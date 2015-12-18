Title: Matlab
Date: 2015-11-10
Category: software
Tags: Odyssey, Matlab
Summary: Using Matlab on Odyssey.

## Introduction
Research Computing has licensed MATLAB from Mathworks for use on desktops, laptops, and on Odyssey. If you wish to run MATLAB on your desktop/laptop, please follow the instructions on the <a href="http://downloads.fas.harvard.edu/download?platform=all" target="_blank">FAS downloads page</a> (downloads for all platforms are available from Mathworks). Running MATLAB on Odyssey can be done through a GUI using X11, at the command line interactive, or through batch jobs.

**NOTE! These instructions discuss the single-core (process) implementation. If you wish to run MATLAB as a multi-core/process job, please see our [companion document](parallel-matlab-pct-dcs.html).**


## MATLAB GUI on Odyssey
The MATLAB GUI can be run using the power of the compute nodes of Odyssey by initiating your session via our graphical login, and starting an interactive MATLAB session. This is almost like running MATLAB on your desktop/laptop, except all the computation is done on Odyssey.

Log on to the cluster via our [NoMachine instructions](access-and-login.html#Consider_an_NX_remote_desktop_for_graphical_applications_like_Matlab_and_RStudio) and and follow the directions through starting your interactive terminal session. 

Note: You can use your own X11 client with X11-forwarding enabled, but the performance will be miserable.

Once logged in, get an [interactive session](running-jobs.html#interactive-jobs-and-srun)

Load and run the MATLAB software

    :::bash
    source new-modules.sh
    module load matlab
    matlab

This will start our new module system, load the latest version of MATLAB, and launch it.


### MATLAB at the terminal command line
MATLAB can also be run at the command line in an interactive terminal session. Since there is no GUI, you must include additional parameters, and you can optionally specify an M file (e.g. script.m or function.m) to run, including any script or function parameters as required:

Fire up your terminal and log into Odyssey as described [here](access-and-login.html).

Once logged in, get an interactive session as described [here](running-jobs.html#interactive-jobs-and-srun).

Load the appropriate software:

    :::bash
    source new-modules.sh
    module load matlab
    
Run MATLAB using the appropriate command and parameters:

    :::bash
    matlab -nojvm -nosplash -nodesktop


and MATLAB should run interactively at your terminal:

    
    < M A T L A B (R) >
    Copyright 1984-2014 The MathWorks, Inc.
    R2014a (8.3.0.532) 64-bit (glnxa64)
    February 11, 2014

    To get started, type one of these: helpwin, helpdesk, or demo.
    For product information, visit www.mathworks.com.
    <>

### MATLAB as batch jobs
You can also submit MATLAB batch jobs to Odyssey. Again, since there is no GUI, you must include additional parameters, and you must specify an M file (e.g. `script.m` or `function.m`) to run, including any script or function parameters as required:

Fire up your terminal and log into Odyssey as described [here](access-and-login.html). 

Create a SLURM batch file (e.g. `my_matlab_job.sh`) and include your resource requests and your MATLAB command:

    :::bash
    #!/bin/bash
    #SBATCH -J my_matlab_job
    #SBATCH -p serial_requeue
    #SBATCH -t 0-6:00
    #SBATCH -n 1
    #SBATCH -N 1
    #SBATCH -o my_matlab_job.out
    #SBATCH -e my_matlab_job.err

    source new-modules.sh
    module load matlab
    matlab -nojvm -nodisplay -nosplash -r "my_function(10,30)"

Submit the job to the scheduler: 

    :::bash
    sbatch my_matlab_job.sh

<b>NOTE</b>: when running large numbers of short functions or scripts as jobs, it is best to bundle as many together as possible to achieve an average run-time of around 10 minutes. This is more easy for the SLURM scheduler to handle than hundreds/thousands of very short jobs.
