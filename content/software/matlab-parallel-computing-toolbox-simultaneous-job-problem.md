Title: MATLAB Parallel Computing Toolbox simultaneous job problem
Date: 2016-01-08
Category: software
Tags: Odyssey, Matlab, Slurm
Summary: This document describes a potential problem that occurs when using the Parallel Computing Toolbox (PCT) on Odyssey.

### Introduction
This document describes a potential problem that occurs when using the Parallel Computing Toolbox (PCT) on Odyssey. If you are not familiar with the PCT, please read our [companion document](matlab-parallel-pct-and-dcs.html) first.

This problem only affects users submitting multiple jobs simultaneously to SLURM on Odyssey using the Parallel Computing Toolbox or the Distributed Computing Server. If you are unsure if this affects your workflow, please contact [RCHelp](rchelp>).

### Description of the problem
Sometimes multiple parallel MATLAB jobs using the Parallel Computing Toolbox (PCT) would crash. The usual scenario is that the first job would run, but the subsequent jobs would hang or crash as MATLAB won't allow for a second `matlabpool` to open.

### Analysis and resolution of the problem
When a person submit multiple jobs that are all using PCT for parallelization, the multiple `matlabpool`s that get created have the ability to interfere with one another and this can lead to errors and early termination of scripts.

The MATLAB PCT requires a temporary *Job Storage Location* where it stores information about the MATLAB pool that is in use. This is simply a directory on the filesystem that MATLAB writes various files to in order to coordinate the parallelization of the `matlabpool`. By default, this information is stored in `/home/YourUsername/.matlab/` (the default `JobStorageLocation`). When submitting multiple jobs to SLURM that will all use the PCT, all of the jobs will attempt to use this default location for storing job information, thereby creating a race condition where one job modifies the files that were put in place by another. Clearly, this situation must be avoided.

The solution is to have each of your jobs that will use the PCT set a unique location for storing job information. To do this, a temporary directory must be created before launching MATLAB in your submission script and then the `matlabpool` must be created to explicitly use this unique temporary directory.

The following is an example batch job submission script to do this:

    :::bash
    #!/bin/bash
    #
    #SBATCH -J par_for_test
    #SBATCH -p general
    #SBATCH -t 0-0:30
    #SBATCH -n 12
    #SBATCH -N 1
    #SBATCH --mem-per-cpu=2000
    #SBATCH -o par_for_test.out
    #SBATCH -e par_for_test.err

    module load matlab/R2014a-fasrc01

    # Create a local work directory
    mkdir -p /scratch/$USER/$SLURM_JOB_ID
    matlab-default -nosplash -nodesktop -r "pfor"

    # Cleanup local work directory
    rm -rf /scratch/$USER/$SLURM_JOB_ID</div>

Also, the corresponding MATLAB script needs to include these lines:

    :::matlab
    % create a local cluster object
    pc = parcluster('local')
    
    % explicitly set the JobStorageLocation to the temp directory that was
    % created in your sbatch script
    pc.JobStorageLocation = strcat('/scratch/YourUsername/', getenv('SLURM_JOB_ID'))
    
    % start the parallel pool with 12 workers
    matlabpool(pc, 12)

**NOTE:** MATLAB discontinues the use of `matlabpool` and replaces this with `parpool` in release R2013b and later. Also, one is able to deploy unlimited MATLAB workers on a compute node with the latest installations.

    :::matlab
    [pkrastev@holy2a18302 test]$ cat par_for_test.out
     
    < M A T L A B (R) >
    Copyright 1984-2014 The MathWorks, Inc.
    R2014a (8.3.0.532) 64-bit (glnxa64)
    February 11, 2014
    To get started, type one of these: helpwin, helpdesk, or demo.
    For product information, visit www.mathworks.com.
     
    pc =
     
    Local Cluster
     
    Properties:
     
    Profile: local
    Modified: false
    Host: zorana01.rc.fas.harvard.edu
    NumWorkers: 32
     
    JobStorageLocation: /n/home06/pkrastev/.matlab/local_cluster_jobs/R2014a
    RequiresMathWorksHostedLicensing: false
     
    Associated Jobs:
     
    Number Pending: 0
    Number Queued: 0
    Number Running: 0
    Number Finished: 0
    pc =
     
    Local Cluster
     
    Properties:
     
    Profile: local
    Modified: true
    Host: zorana01.rc.fas.harvard.edu
    NumWorkers: 32
     
    JobStorageLocation: /scratch/pkrastev/15697660
    RequiresMathWorksHostedLicensing: false
     
    Associated Jobs:
     
    Number Pending: 0
    Number Queued: 0
    Number Running: 0
    Number Finished: 0
     
    Starting parallel pool (parpool) using the 'local' profile ... connected to 8 workers.
     
    ans =
     
    Pool with properties:
     
    Connected: true
    NumWorkers: 8
    Cluster: local
    AttachedFiles: {}
    IdleTimeout: 30 minute(s) (30 minutes remaining)
    SpmdEnabled: true
     
    The computed value of pi is 3.1408824.
    The parallel Monte-Carlo method is executed in 13.61 seconds.


### Further reading
MATLAB's documentation on [JobStorageLocation](http://www.mathworks.com/help/distcomp/parallel.cluster.html)

