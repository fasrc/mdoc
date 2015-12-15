Title: Convenient Slurm Commands
Date: 2015-11-10
Category: slurm
Tags: Odyssey, Slurm
Summary: A quick overview of some handy Slurm commands.

This page will give you a list of the commonly used commands for SLURM. Although there are a few advanced ones in here, as you start making significant use of the cluster, you'll find that these advanced ones are essential! A good comparison of SLURM, LSF, PBS/Torque, and SGE commands can be found [here](http://slurm.schedmd.com/rosetta.pdf).

### General commands

Get documentation on a command:

    :::bash
    man <command>

Try the following commands:

    :::bash
    man sbatch 
    man squeue 
    man scancel

### Submitting jobs

The following example script specifies a partition, time limit, memory allocation and number of cores. All your scripts should specify values for these four parameters. You can also set additional parameters as shown, such as jobname, output file and email notification. For This script performs a simple task — it generates of file of random numbers and then sorts it. A detailed explanation the script is available [here](http://informatics.fas.harvard.edu/?page_id=804).

    :::bash
    #!/bin/bash # 
    #SBATCH -p general # partition (queue) 
    #SBATCH -N 1 # number of nodes 
    #SBATCH -n 1 # number of cores 
    #SBATCH --mem 100 # memory pool for all cores 
    #SBATCH -t 0-2:00 # time (D-HH:MM) 
    #SBATCH -o slurm.%N.%j.out # STDOUT 
    #SBATCH -e slurm.%N.%j.err # STDERR 
    #SBATCH --mail-type=END,FAIL # notifications for job done & fail 
    #SBATCH --mail-user=myemail@harvard.edu # send-to address   
    
    for i in {1..100000}; do 
        echo $RANDOM >> SomeRandomNumbers.txt 
    done   
    sort SomeRandomNumbers.txt

Now you can submit your job with the command:

    :::bash
    sbatch myscript.sh

### Information on jobs

List all current jobs for a user:

    :::bash
    squeue -u <username>

List all running jobs for a user:

    :::bash
    squeue -u <username> -t RUNNING

List all pending jobs for a user:

    :::bash
    squeue -u <username> -t PENDING

List priority order of jobs for the current user (you) in a given partition:

    :::bash
    showq-slurm -o -U -q <partition>

List all current jobs in the general partition for a user:

    :::bash
    squeue -u <username> -p general

List detailed information for a job (useful for troubleshooting):

    :::bash
    scontrol show jobid -dd <jobid>

List status info for a currently running job:

    :::bash
    sstat --format=AveCPU,AvePages,AveRSS,AveVMSize,JobID -j <jobid> --allsteps

Once your job has completed, you can get additional information that was not available during the run. This includes run time, memory used, etc. To get statistics on completed jobs by jobID:

    :::bash
    sacct -j <jobid> --format=JobID,JobName,MaxRSS,Elapsed

To view the same information for all jobs of a user:

    :::bash
    sacct -u <username> --format=JobID,JobName,MaxRSS,Elapsed

### Controlling jobs

To cancel one job:

    :::bash
    scancel <jobid>

To cancel all the jobs for a user:

    :::bash
    scancel -u <username>

To cancel all the pending jobs for a user:

    :::bash
    scancel -t PENDING -u <username>

To cancel one or more jobs by name:

    :::bash
    scancel --name myJobName

To pause a particular job:

    :::bash
    scontrol hold <jobid>

To resume a particular job:

    :::bash
    scontrol resume <jobid>

To requeue (cancel and rerun) a particular job:

    :::bash
    scontrol requeue <jobid>

### Job arrays and useful commands

As shown in the commands above, its easy to refer to one job by its Job ID, or to all your jobs via your username. What if you want to refer to a subset of your jobs? The answer is to submit your job set as a job array. Then you can use the job array ID to refer to the set when running SLURM commands. See the following excellent resources for further information: [Running Jobs: Job Arrays](https://rc.fas.harvard.edu/resources/running-jobs/#Job_arrays) [SLURM job arrays](http://slurm.schedmd.com/job_array.html) To cancel an indexed job in a job array:

    :::bash
    scancel <jobid>_<index>

e.g.

    :::bash
    scancel 1234_4

### Advanced (but useful!) commands

The following commands work for individual jobs and for job arrays, and allow easy manipulation of large numbers of jobs. You can combine these commands with the parameters shown above to provide great flexibility and precision in job control. (Note that all of these commands are entered on one line) Suspend all running jobs for a user (takes into account job arrays):

    :::bash
    squeue -ho %A -t R | xargs -n 1 scontrol suspend

Resume all suspended jobs for a user:

    :::bash
    squeue -o "%.18A %.18t" -u <username> | awk '{if ($2 =="S"){print $1}}' | xargs -n 1 scontrol resume

After resuming, check if any are still suspended:

    :::bash
    squeue -ho %A -u $USER -t S | wc -l