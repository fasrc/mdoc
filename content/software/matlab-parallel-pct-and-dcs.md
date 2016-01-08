Title: MATLAB parallel - PCT and DCS
Date: 2016-01-08
Category: software
Tags: Odyssey, Matlab, Slurm
Summary: Running Matlab in parallel using the Parallel Computing Toolbox and Distributed Computing Server

**NOTE:** After the last SLURM upgrade the default maximum number of workers in the Parallel Computing Toolbox (PCT) is set up to 1. In order to use the desired number of workers one needs to set up `NumWorkers` explicitly in MATLAB to the number of reserved compute cores, e.g.,

    :::matlab
    >> pc=parcluster('local') 
    >> pc.NumWorkers=16

## Introduction
This page is intended to help you with running parallel MATLAB codes on the Odyssey cluster. The latest software modules supporting parallel computing with MATLAB available on the cluster are:

    matlab/R2014a-fasrc01
    matlab/R2014b-fasrc01
    matlab/R2015a-fasrc01

Parallel processing with MATLAB is performed with the help of two products, [**Parallel Computing Toolbox**](http://www.mathworks.com/products/parallel-computing) (PCT) and [**Distributed Computing Server**](http://www.mathworks.com/products/distriben/index.html) (DCS).

## Parallel Computing Toolbox

Currently, PCT provides up to 32 workers (MATLAB computational engines) to execute applications locally on a multicore machine. This means that with the toolbox one could run parallel MATLAB codes locally on the compute nodes and use up to 32 cores. Most of the compute nodes on the cluster have 64 cores per node.

### Parallel FOR loops (parfor)

Below is a simple code illustrating the use of PCT to calculate PI via a parallel Monte-Carlo method. This example also illustrates the use of [**parfor**](http://www.mathworks.com/help/distcomp/parfor.html) (parallel FOR) loops. In this scheme, suitable FOR loops could be simply replaced by parallel FOR loops without other changes to the code:

    :::matlab
    %============================================================================ 
    % Parallel Monte Carlo calculation of PI 
    %============================================================================ 
    parpool('local', str2num(getenv('SLURM_NTASKS'))) % Important!!
    R = 1; 
    darts = 1e7; 
    count = 0; 
    tic parfor i = 1:darts 
        % Compute the X and Y coordinates of where the dart hit the............... 
        % square using Uniform distribution....................................... 
        x = R*rand(1); 
        y = R*rand(1); 
        if x^2 + y^2 <= R^2 
    % Increment the count of darts that fell inside of the................. 
    % circle............................................................... 
    count = count + 1; % Count is a reduction variable. 
        end 
    end 
    % Compute pi................................................................. 
    myPI = 4*count/darts; 
    T = toc; 
    fprintf('The computed value of pi is %8.7f.\n',myPI); 
    fprintf('The parallel Monte-Carlo method is executed in %8.2f seconds.\n', T); 
    % Release the workers. Important!!
    delete(gcp);
    exit;

**Important: When using `parpool` in MATLAB, you need include the statement `parpool('local', str2num(getenv('SLURM_NTASKS')))` in your code**. This statement tells MATLAB to start `SLURM_NTASKS` workers on the local machine (the compute node where your job lands). When the parallel computation is done, the MATLAB workers are released with the statement `delete(gcp)`. If the above code is named, e.g., `pfor.m`, it can be sent to the queue with the below batch-job submission script. It starts a MATLAB parallel job with 8 workers:

    :::bash
    #!/bin/bash 
    # 
    #SBATCH -J pfor 
    #SBATCH -o pfor.out 
    #SBATCH -e pfor.err 
    #SBATCH -N 1
    #SBATCH -n 8 
    #SBATCH -t 0-00:30 
    #SBATCH -p serial_requeue 
    #SBATCH --mem=4000   
    
    module load matlab/R2014b-fasrc01 
    matlab-default -nosplash -nodesktop -r "pfor"

The SBATCH directives `-N 1` and `-n 8` assure that there are 8 processing cores for the calculation, and they all reside on the same compute node. **The number of cores you request must match the number of workers you spawn**, otherwise you will negatively affect your job and all others running on that node. `matlab-default` must be called instead of the default `matlab` as only the former binary is allowed to spawn multiple processes.

If the submission script is named `pfor.run`, it is submitted to the queue by typing in

    :::bash
    [pkrastev@sa01 test2]$ sbatch pfor.run 
    Submitted batch job 43510604

When the job has completed the `pfor.out` output file is generated.

    :::matlab-session
    MATLAB is selecting SOFTWARE OPENGL rendering.
     
                       < M A T L A B (R) >
             Copyright 1984-2014 The MathWorks, Inc.
              R2014b (8.4.0.150421) 64-bit (glnxa64)
                        September 15, 2014
     
     
    To get started, type one of these: helpwin, helpdesk, or demo.
    For product information, visit www.mathworks.com.
     
    Starting parallel pool (parpool) using the 'local' profile ... connected to 8 workers.
     
    ans =
     
     Pool with properties:
     
       Connected: true
      NumWorkers: 8
         Cluster: local
       AttachedFiles: {}
     IdleTimeout: 30 minute(s) (30 minutes remaining)
     SpmdEnabled: true
     
    The computed value of pi is 3.1409520.
    The parallel Monte-Carlo method is executed in    20.30 seconds.
    Parallel pool using the 'local' profile is shutting down.
    Any runtime errors would go to the file `pfor.err`.

### Single Program Multiple Data (SPMD)

In addition, MATLAB also provides a [**single program multiple data**](http://www.mathworks.com/help/distcomp/spmd.html) (SPMD) parallel programming model, which allows for a greater control over the parallelization -- tasks could be distributed and assigned to parallel processes ( labs or workers in MATLAB's terminology ) depending on their ranks. The below code provides a simple illustration -- it prints out the worker rank from each MATLAB lab:

    :::matlab
    %====================================================================
    % Illustration of SPMD Parallel Programming model with MATLAB
    %====================================================================
    parpool('local', str2num(getenv('SLURM_NTASKS')))
    % Start of parallel region...........................................
    spmd
      nproc = numlabs;  % get total number of workers
      iproc = labindex; % get lab ID
      if ( iproc == 1 )
    fprintf ( 1, ' Running with  %d labs.n', nproc );
      end
      for i = 1: nproc
    if iproc == i
       fprintf ( 1, ' Rank %d out of  %d.n', iproc, nproc );
    end
      end
    % End of parallel region.............................................
    end
    delete(gcp);
    exit;
    
If the code is named `spmd_test.m`, it could be sent to the queue with this script

    :::bash
    #!/bin/bash
    #
    #SBATCH -J spmd_test
    #SBATCH -o spmd_test.out
    #SBATCH -e spmd_test.err
    #SBATCH -N 1
    #SBATCH -n 8
    #SBATCH -t 0-00:30
    #SBATCH -p serial_requeue
    #SBATCH --mem=4000
     
    module load matlab/R2014b-fasrc01
    matlab-default -nosplash -nodesktop -r "spmd_test"

    
If the batch-job submission script is named `spmd_test.run`, then it is sent to the queue with

    :::bash
    [pkrastev@sa01 test2]$ sbatch spmd_test.run 
    Submitted batch job 43515333

The output is printed out to the file `spmd_test.out`:

    :::matlab
    MATLAB is selecting SOFTWARE OPENGL rendering.
     
                       < M A T L A B (R) >
             Copyright 1984-2014 The MathWorks, Inc.
              R2014b (8.4.0.150421) 64-bit (glnxa64)
                        September 15, 2014
     
     
    To get started, type one of these: helpwin, helpdesk, or demo.
    For product information, visit www.mathworks.com.
     
    Starting parallel pool (parpool) using the 'local' profile ... connected to 8 workers.
     
    ans =
     
     Pool with properties:
     
       Connected: true
      NumWorkers: 8
         Cluster: local
       AttachedFiles: {}
     IdleTimeout: 30 minute(s) (30 minutes remaining)
     SpmdEnabled: true
     
    Lab 1:
       Running with  8 labs.
       Rank 1 out of  8.
    Lab 2:
       Rank 2 out of  8.
    Lab 3:
       Rank 3 out of  8.
    Lab 4:
       Rank 4 out of  8.
    Lab 5:
       Rank 5 out of  8.
    Lab 6:
       Rank 6 out of  8.
    Lab 7:
       Rank 7 out of  8.
    Lab 8:
       Rank 8 out of  8.
    Parallel pool using the 'local' profile is shutting down.

## Distributed Computing Server

The DCS allows for a larger number of MATLAB workers to be used on a single node and/or across several compute nodes. The current DCS license we have on the cluster allows for using up to 256 MATLAB workers. Currently, DCS is integrated with SLURM and works with **MATLAB versions R2014a, R2014b and R2015a**, available with LMOD software modules **matlab/R2014a-fasrc01**, **matlab/R2014b-fasrc01** and **matlab/R2015a-fasrc01**. The below example steps describe how to set up and use DCS on the cluster:

(1) Log on to the cluster via our NoMachineX (instructions [here](access-and-login.html#consider-an-nx-remote-desktop-for-graphical-applications-like-matlab-and-rstudio)) and start the MATLAB's GUI. (You can use your own X11 client with X11-forwarding enabled, but the performance will be sluggish.)

    :::bash
    [pkrastev@sa01 test2]$ matlab

(2) Configure DCS to run parallel jobs on Odyssey by calling `configCluster`. This needs to be called only once for each MATLAB version.

<figure>
	<a class="img" href="/docs/images/dcs1.png">
    		<img class="img-responsive" src="/docs/images/dcs1.png"></img>
	</a>
    <figcaption></figcaption>
</figure>

(3) Setup job parameters, e.g., Wall Time, queue / partition, Memory-Per-CPU, etc. The below example illustrates how this can be done interactively. Once these parameters are set up, their values become default unless changed.

<figure>
	<a class="img" href="/docs/images/dcs2.png">
    		<img class="img-responsive" src="/docs/images/dcs2.png"></img>
	</a>
    <figcaption></figcaption>
</figure>

(4) Display parallel cluster configuration with `ClusterInfo.state`.

NOTE: This lists the available cluster options and their current values. These options could be set up as desired.

<figure>
	<a class="img" href="/docs/images/dcs3.png">
    		<img class="img-responsive" src="/docs/images/dcs3.png"></img>
	</a>
    <figcaption></figcaption>
</figure>

(5) Submit parallel DCS jobs. There are two ways to submit parallel DCS jobs - from within MATLAB, and directly through SLURM.

### Submitting DCS jobs from within MATLAB

We will illustrate submitting DCS jobs from within MATLAB with a specific example. Below is a simple function evaluating the integer sum from 1 through N in parallel:

    :::matlab
    %==========================================================
    % Function: parallel_sum( N )
    %           Calculates integer sum from 1 to N in parallel
    %==========================================================
    function s = parallel_sum(N)
      s = 0;
      parfor i = 1:N
    s = s + i;
      end
      fprintf('Sum of numbers from 1 to %d is %d.n', N, s);
    end

Use the `batch` command to submit parallel jobs to the cluster. The batch command will return a job object which is used to access the output of the submitted jobs. See the example below and refer to the official MATLAB documentation for more help on [batch](http://www.mathworks.com/help/distcomp/batch.html). This assumes that the MATLAB function is named `parallel_sum.m`. Note that these jobs will always request n+1 CPU cores, since one worker is required to manage the batch job and pool of workers. For example, a job that needs 8 workers will consume 9 CPU cores.

    :::matlab
    % Define a cluster object
    >> c = parcluster;
    % Define a job object using batch
    >> j = c.batch(@parallel_sum, 1, {100}, 'pool', 8);
 
 
 <figure>
	<a class="img" href="/docs/images/dcs4.png">
    		<img class="img-responsive" src="/docs/images/dcs4.png"></img>
	</a>
    <figcaption></figcaption>
</figure>

Once the job completes, we can retrieve the job results. This is done by calling the function `fetchOutputs`. Then we also need to delete the job object.

NOTE: `fetchOutputs` is used to retrieve function output arguments. Data that has been written to files on the cluster needs to be retrieved directly from the filesystem.

    :::matlab
    % Fetch job results
    >> j.fetchOutputs{:};
    % Delete job object
    >> j.delete;

 <figure>
	<a class="img" href="/docs/images/dcs5.png">
    		<img class="img-responsive" src="/docs/images/dcs5.png"></img>
	</a>
    <figcaption></figcaption>
</figure>
    

### Submitting DCS jobs directly through SLURM

Parallel DCS jobs could be submitted directly from the Unix command line through SLURM. For this, in addition to the MATLAB source, one needs to prepare a MATLAB submission script with the job specifications. An example is shown below:


    :::matlab
    %==========================================================
    % MATLAB job submission script: parallel_batch.m
    %==========================================================
    c = parcluster;
    ClusterInfo.setWallTime('01:00:00');
    ClusterInfo.setQueueName('serial_requeue');
    ClusterInfo.setMemUsagePerCpu('4000');
    j = c.batch(@parallel_sum, 1, {100}, 'pool', 8);
    exit;
    
If this is script is named, for instance, `parallel_batch.m`, it is submitted to the queue with the help of the following SLURM batch-job submission script:

    :::bash
    #!/bin/bash
    #
    #SBATCH -J parallel_sum_DCS
    #SBATCH -o parallel_sum_DCS.out
    #SBATCH -e parallel_sum_DCS.err
    #SBATCH -p serial_requeue
    #SBATCH -n 1
    #SBATCH -t 0-00:20
    #SBATCH --mem=2000
     
    matlab-default -nosplash -nodesktop -r "parallel_batch"

Assuming the above script is named `parallel_sum_DCS.run`, for instance, the job is submitted as usual with

    :::bash
    sbatch parallel_sum_DCS.run

NOTE: This scheme dispatches 2 jobs - one serial that spawns the actual DCS parallel jobs, and another, the actual parallel job.

Once submitted, the DCS parallel job can be monitored and managed directly through SLURM.

<figure>
	<a class="img" href="/docs/images/dcs6.png">
    		<img class="img-responsive" src="/docs/images/dcs6.png"></img>
	</a>
    <figcaption></figcaption>
</figure>


After the job completes, one can fetch results and delete job object from within MATLAB. If program writes directly to disk fetching is not necessary.

    :::matlab
    >> j.fetchOutputs{:};
    >> j.delete;
    
## References

*   [Parallel Computing Toolbox](http://www.mathworks.com/products/parallel-computing)
*   [Distributed Computing Server](http://www.mathworks.com/products/distriben/index.html)