Title: Running Jobs
Date: 2015-11-10
Category: guides
Tags: Odyssey, Slurm, MPI
Summary: This guide will provide you with details about how to run Slurm jobs on the Odyssey cluster.

##The Odyssey cluster uses Slurm to manage jobs
[Slurm](slurm>) is a queue management system and stands for Simple Linux Utility for Resource Management. Slurm was developed at the Lawrence Livermore National Lab and currently runs some of the largest compute clusters in the world. 

Slurm is similar in many ways to most other queue systems. You write a batch script then submit it to the queue manager. The queue manager then schedules your job to run on the queue (or partition in Slurm parlance) that you designate. Below we will provide an outline of how to submit jobs to Slurm, how Slurm decides when to schedule your job and how to monitor progress.  

Slurm has a number of valuable features compared to other job management systems:

*   _Kill and Requeue_ Slurm’s ability to kill and requeue is superior to that of other systems. It waits for jobs to be cleared before scheduling the high priority job. It also does kill and requeue on memory rather than just on core count.
*   _Memory_ Memory requests are sacrosanct in Slurm. Thus the amount of memory you request at run time is guaranteed to be there. No one can infringe on that memory space and you cannot exceed the amount of memory that you request.
*   _Accounting Tools_ Slurm has a back end database which stores historical information about the cluster. This information can be queried by the users who are curious about how much resources they have used.

## General Slurm documentation is widely available.
The primary source for documentation on Slurm usage and commands can be found at the [Slurm site](slurm>/documentation.html). If you Google for Slurm questions, you'll often see the Lawrence Livermore pages as the top hits, but these tend to be outdated. A great way to get details on the Slurm commands is the man pages available from the Odyssey cluster. For example, if you type the following command:

    :::shell-session
    man sbatch

you'll get the manual page for the sbatch command.

## Odyssey jobs are generally run from the command line
Once you've gone through the account setup procedure and [obtained a suitable terminal application]({filename}/access-and-login.html#Use_any_common_terminal_application_for_command_line_access), you can login to the Odyssey system via ssh

    :::shell-session
    ssh <USERNAME>@odyssey.rc.fas.harvard.edu

where &lt;USERNAME&gt; is the RC login you received from the [account request tool](account>). This is generally not the same as your HUIT machine login and is not your Harvard ID. 

Odyssey computers run the CentOS 6.5 version of the Linux operating system and commands are run under the "bash" shell. There are a number of Linux and bash [references](http://www.gnu.org/software/bash/manual/bashref.html), [cheat sheets](http://cli.learncodethehardway.org/bash_cheat_sheet.pdf) and [tutorials](http://www.tldp.org/LDP/Bash-Beginners-Guide/html/) available on the web. RC's own [training](https://rc.fas.harvard.edu/training/intro-to-unix/) are also available. 

## Odyssey applications should not be run from login nodes
Once you have logged in to the Odyssey system, you will be on one of a handful of access nodes (e.g. rclogin04).  These nodes are shared entry points for all users and so cannot be used to run computationally intensive software.  

Simple file copies, light text processing or editing, etc. are fine, but you should not run large graphical applications like Matlab, or computationally intensive command line tools.c
A culling program runs on these nodes that will kill any application that exceeds memory and computational limits.

Entry nodes for NoMachine remote desktops (see below) like holynx01 are also to be treated like login nodes.


## An enhanced module system called Helmod is used for enabling applications 
Because of the diversity of investigations currently supported by FAS, thousands of applications and libraries are supported on the Odyssey cluster. Technically, it is impossible to include all of these tools in every user's environment. 

The Research Computing and Informatics departments have developed an enhanced Linux [module system](http://modules.sourceforge.net), [Helmod]({filename}/helmod.html), based on the hierarchical [Lmod module system from TACC](https://www.tacc.utexas.edu/research-development/tacc-projects/lmod).  Helmod prevents enables applications much the same way as Linux modules, but also prevents multiple versions of the same tool from being loaded at the same time and separates tools that use particular compilers or MPI libraries entirely.

A `module load` command enables a particular application in the environment, mainly by adding the application to your PATH variable. For example, to enable the currently supported R package:

    :::shell-session
    module load R/3.2.0-fasrc01

<figure>
	<a class="img" href="/docs/images/module-load-R.png">
    		<img class="img-responsive" src="/docs/images/module-load-R.png"></img>
	</a>
    <figcaption>module load R.</figcaption>
</figure>


Loading more complex modules can affect a number of environment variables including `PYTHONPATH`, `LD_LIBRARY_PATH`, `PERL5LIB`, etc. Modules may also load dependencies. 

The `module purge` command will remove all currently loaded modules. This is particularly useful if you have to run incompatible software (e.g. python 2.x or python 3.x). The `module unload` command will remove a specific module. 

Finding the modules that are appropriate for your needs can be done in a couple of different ways. The [module search page](https://portal.rc.fas.harvard.edu/apps/modulelist/) allows you to browse and search the list of modules that have been deployed to Odyssey. 

There are a number of command line options for module searching, including the `module avail` command for browsing the entire list of applications and the `module-query` command for keyword searching.

Though there are many modules available by default, the hierarchical Helmod system enables additional modules after loading certain key libraries such as compilers and MPI packages.  The `module avail` command output reflects this.

<figure>
	<a class="img" href="/docs/images/module-avail-gcc.png">
    		<img class="img-responsive" src="/docs/images/module-avail-gcc.png"></img>
	</a>
    <figcaption>View the available modules after loading a compiler.</figcaption>
</figure>

The Helmod `module-query` command supports more sophisticated queries and returns additional information for modules.  If you query by the name of an application or library (e.g. hdf5), you'll retrieve a consolidated report showing all of the modules grouped together for a particular application.

<figure>
	<a class="img" href="/docs/images/module-query-hdf5.png">
    		<img class="img-responsive" src="/docs/images/module-query-hdf5.png"></img>
	</a>
    <figcaption>module-query for hdf5.</figcaption>
</figure> 

A query for a single module, however, will return details about that build including module load statements and build comments (if any exist).

<figure>
	<a class="img" href="/docs/images/module-query-hdf5-1.8.12.png">
    		<img class="img-responsive" src="/docs/images/module-query-hdf5-1.8.12.png"></img>
	</a>
    <figcaption>module-query for hdf5/1.8.12.</figcaption>
</figure>

For more details about the Helmod module system, check out the [Software on Odyssey]({filename}/software-on-odyssey.html) page, or the [Helmod tagged articles]({filename}/tag/Helmod.html)

## Summary of Slurm commands

The table below shows a summary of Slurm commands. These commands are described in more detail below along with links to the Slurm doc site.

<table>
	<tbody>
		<tr>
			<th></th>
			<th>Slurm</th>
			<th>Slurm Example</th>
		</tr>
		<tr>
			<td>Submit a batch serial job</td>
			<td><a href="http://slurm.schedmd.com/sbatch.html">sbatch</a></td>
			<td><code>sbatch runscript.sh</code></td>
		</tr>
		<tr>
			<td>Run a script interatively</td>
			<td><a href="http://slurm.schedmd.com/srun.html">srun</a></td>
			<td><code>srun --pty -p interact -t 10 --mem 1000 /bin/bash /bin/hostname</code></td>	
		</tr>
		<tr>
			<td>Kill a job</td>
			<td><a href="http://slurm.schedmd.com/scancel.html">scancel</a></td>
			<td><code>scancel 999999</code></td>
		</tr>
		<tr>
			<td>View status of queues</td>
			<td><a href="http://slurm.schedmd.com/squeue.html">squeue</a></td>
			<td><code>squeue -u akitzmiller</code></td>
		</tr>
		<tr>			
			<td>Check current job by id</td>
			<td><a href="http://slurm.schedmd.com/squeue.html">sacct</a></td>
			<td><code>sacct -j 999999</code></td>
		</tr>
	</tbody>
</table>

## General Slurm resources

Though Slurm is not as common as SGE or LSF, documentation is readily available.

*   [Common Slurm commands](/resources/documentation/convenient-slurm-commands/)
*   [Official Slurm web site](http://slurm.schedmd.com)
*   [Official Slurm documentation](http://slurm.schedmd.com/documentation.html)
*   [Slurm tutorial videos](http://slurm.schedmd.com/tutorials.html)
*   [LLNL quick start user guide](https://computing.llnl.gov/linux/slurm/quickstart.html)

## Submitting batch jobs using the `sbatch` command

The main way to run jobs on Odyssey is by submitting a script with the `sbatch` command. The command to submit a job is as simple as:

    :::shell-session
    sbatch runscript.sh

The commands specified in the runscript.sh file will then be run on the first available compute node that fits the resources requested in the script. `sbatch` returns immediately after submission; commands are not run as foreground processes and won't stop if you disconnect from Odyssey. A typical submission script, in this case using the `hostname` command to get the computer name, will look like this:

    :::bash
    #!/bin/bash 
    #SBATCH -n 1                    # Number of cores 
    #SBATCH -N 1                    # Ensure that all cores are on one machine 
    #SBATCH -t 0-00:05              # Runtime in D-HH:MM 
    #SBATCH -p serial_requeue       # Partition to submit to 
    #SBATCH --mem=100               # Memory pool for all cores (see also --mem-per-cpu) 
    #SBATCH -o hostname.out         # File to which STDOUT will be written 
    #SBATCH -e hostname.err         # File to which STDERR will be written 
    #SBATCH --mail-type=END         # Type of email notification- BEGIN,END,FAIL,ALL 
    #SBATCH --mail-user=ajk@123.com # Email to which notifications will be sent
       
    hostname

In general, the script is composed of 3 parts. 

* the `#!/bin/bash` line allows the script to be run as a bash script
* the `#SBATCH` lines are technically bash comments, but they set various parameters for the Slurm scheduler
* the command line itself. 

The `#SBATCH` lines shown above set key parameters. *N.B. It is important to keep all `#SBATCH` lines together and at the top of the script; no bash code or variables settings should be done until after the `#SBATCH` lines.* The Slurm system copies many environment variables from your current session to the compute host where the script is run including `PATH` and your current working directory. As a result, you can specify files relative to your current location (e.g. `./project/myfiles/myfile.txt`).

#### `#SBATCH -n 1`
This line sets the number of cores that you're requesting. Make sure that your tool can use multiple cores before requesting more than one. If this parameter is omitted, Slurm assumes `-n 1`.

#### `#SBATCH -N 1`
This line requests that the cores are all on node. Only change this to >1 if you know your code uses a message passing protocol like MPI. Slurm makes no assumptions on this parameter -- if you request more than one core (-n > 1) and your forget this parameter, your job may be scheduled across nodes; and unless your job is MPI (multinode) aware, your job will run slowly, as it is oversubscribed on the master node and wasting resources on the other(s).

#### `#SBATCH -t 5`
This line specifies the running time for the job in minutes. You can also the convenient format D-HH:MM. If your job runs longer than the value you specify here, it will be cancelled. Jobs have a maximum run time of 7 days on Odyssey, though extensions can be done. There is no penalty for over-requesting time. **NOTE!** If this parameter is omitted on any partition, the your job will be given the default of 10 minutes.

#### `#SBATCH -p serial_requeue`
This line specifies the Slurm partition (AKA queue) under which the script will be run. The serial_requeue partition is good for routine jobs that can handle being occasionally stopped and restarted. PENDING times are typically short for this queue. See the [partitions description below](#Slurm_partitions) for more information

#### `#SBATCH --mem=100`
The Odyssey cluster requires that you specify the amount of memory (in MB) that you will be using for your job. Accurate specifications allow jobs to be run with maximum efficiency on the system. There are two main options, `--mem-per-cpu` and `--mem`. The `--mem` option specifies the total memory pool for one or more cores, and is the recommended option to use. If you must do work across multiple compute nodes (e.g. MPI code), then you must use the `--mem-per-cpu` option, as this will allocate the amount specified for each of the cores you're requested, whether it is on one node or multiple nodes. If this parameter is omitted, the smallest amount is allocated, usually 100 MB. And chances are good that your job will be killed as it will likely go over this amount.

#### `#SBATCH -o hostname.out`
This line specifies the file to which standard out will be appended. If a relative file name is used, it will be relative to your current working directory. If this parameter is omitted, any output will be directed to a file named Slurm-JOBID.out in the current directory.

#### `#SBATCH -e hostname.err`
This line specifies the file to which standard error will be appended. Slurm submission and processing errors will also appear in the file. If this parameter is omitted, any output will be directed to a file named Slurm-JOBID.out in the current directory.

#### `#SBATCH --mail-type=END`
Because jobs are processed in the "background" and can take some time to run, it is useful send an email message when the job has finished (--mail-type=END). Email can also be sent for other processing stages (START, FAIL) or at all of the times (ALL)

#### `#SBATCH --mail-user=ajk@123.com<`
The email address to which the --mail-type messages will be sent.

### It is important to accurately request resources, **especially memory**

Odyssey is a large, shared system that must have an accurate idea of the resources your program(s) will use so that it can effectively schedule jobs. If insufficient memory is allocated, your program may crash (often in an unintelligible way); if too much memory is allocated, resources that could be used for other jobs will be wasted. Additionally, your "fairshare", a number used in calculating the priority of your job for scheduling purposes, can be adversely affected by over-requesting. Therefore it is important to be as accurate as possible when requesting cores (`-n`) and memory (`--mem` or `--mem-per-cpu`). 

Many scientific computing tools can take advantage of multiple processing cores, but many cannot. A typical R script, for example will not use multiple cores. On the other hand, RStudio, a graphical console for R is a Java program that is improved substantially by using multiple cores. Or, you can use the [Rmpi](https://www.sharcnet.ca/help/index.php/Using_R_and_MPI) package and spawn "slaves" that correspond to the number of cores you've selected. 

The distinction between `--mem` and `--mem-per-cpu` is important when running multi-core jobs (for single core jobs, the two are equivalent). `--mem` sets total memory across all cores, while `--mem-per-cpu` sets the value for each requested core. If you request two cores (`-n 2`) and 4 Gb with `--mem`, each core will receive 2 Gb RAM. If you specify 4 Gb with `--mem-per-cpu`, each core will receive 4 Gb for a total of 8 Gb. 

## Monitoring job progress with squeue and sacct 
`squeue` and `sacct` are two different commands that allow you to monitor job activity in Slurm. `squeue` is the primary and most accurate monitoring tool. `sacct` gives you similar information for running jobs, and can also report on previously finished jobs, but because it accesses the Slurm database, there are some circumstances when the information is not in sync with `squeue`. 

Running `squeue` without arguments will list all currently running jobs. It is more common, though to list jobs for a particular user (like yourself) using the `-u` option...

    :::shell-session
    squeue -u akitzmiller

or for a particular job

    :::shell-session
    squeue -j 9999999

If you include the `-l` option (for "long" output) you can get useful data, including the running state of the job. 

<figure>
	<a class="img" href="/docs/images/squeue-l.png">
    		<img class="img-responsive" src="/docs/images/squeue-l.png"></img>
	</a>
    <figcaption>`squeue` long output using username (`-u`) filter.</figcaption>
</figure>

The default `squeue` tool in your PATH (`/usr/local/bin/squeue`) is a modified version developed by FAS Informatics.  To reduce the load on the Slurm scheduler (RC processes 2.5 million jobs each month), this tool actually queries a centrally collected result from the 'real' `squeue` tool, which can be found at `/usr/bin/squeue`.  This data is collected approximately every 30 seconds.  Many, but not all, of the options from the original tool are supported.  Check this using the `squeue --help` command.

If you need to use all of the options from the real `squeue` tool, simply call it directly (`/usr/bin/squeue`).

The current state of jobs can also be monitored via the [FAS RC/Informatics portal jobs page](https://portal.rc.fas.harvard.edu/jobs/).  You will need to login with your RC credentials.  This draws from the same shared data as the `squeue` command line tool.

The `sacct` command also provides details on the state of a particular job. An `squeue`-like report on a single job is a simple command.

    :::shell-session
    sacct -j 9999999

However `sacct` can provide much more detail as it has access to many of the resource accounting fields that Slurm uses. For example, to get a detailed report on the memory and cpu usage for an array job (see below for details about job arrays): 

<figure>
	<a class="img" href="/docs/images/sacct-array-job.png">
    		<img class="img-responsive" src="/docs/images/sacct-array-job.png"></img>
	</a>
    <figcaption>Listing of job details using sacct.</figcaption>
</figure>


Both tools provide information about the job State. This value will typically be one of PENDING, RUNNING, COMPLETED, CANCELLED, and FAILED.

<table>
	<tbody>
	<tr>
		<td>PENDING</td>
		<td>Job is awaiting a slot suitable for the requested resources. Jobs with high resource demands may spend significant time PENDING.</td>
	</tr>
	<tr>
		<td>RUNNING</td>
		<td>Job is running.</td>
	</tr>
	<tr>
		<td>COMPLETED</td>
		<td>Job has finished and the command(s) have returned successfully (i.e. exit code 0).</td>
	</tr>	
	<tr>	
		<td>CANCELLED</td>
		<td>Job has been terminated by the user or administrator using scancel.</td>
	</tr>
	<tr>
		<td>FAILED</td>
		<td>Job finished with an exit code other than 0.</td>
	</tr>
	</tbody>
</table>

## Killing jobs with scancel 
If for any reason, you need to kill a job that you've submitted, just use the `scancel` command with the job ID.

    :::shell-session
    scancel 9999999

If you don't keep track of the job ID returned from `sbatch`, you should be able to find it with the `squeue -u` command described above.

## Interactive jobs and srun

Though batch submission is the best way to take full advantage of the compute power in Odyssey, foreground, interactive jobs can also be run. These can be useful for things like:

*   Iterative data exploration at the command line
*   RAM intensive graphical applications like MATLAB or SAS.
*   Interactive "console tools" like R and iPython
*   Significant software development and compiling efforts

An interactive job differs from a batch job in two important aspects: 1) the partition to be used is the `interact` partition and, 2) jobs should be initiated with the `srun` command instead of `sbatch`. This command:

    :::shell-session
    srun -p interact --pty --mem 500 -t 0-06:00 /bin/bash

will start a command line shell (`/bin/bash`) on the interactive queue with 500 MB of RAM for 6 hours; 1 core on 1 node is assumed as these parameters (`-n 1 -N 1`) were left out. When the interactive session starts, you will notice that you are no longer on a login node, but rather one of the compute nodes dedicated to this queue. The `--pty` option allows the session to act like a standard terminal. In a pinch, you can also run an application directly *though this is discouraged due to problems setting up bash environment variables*. After loading a module for MATLAB, you can start the application with the following command:

    :::shell-session
    srun -p interact --pty --x11=first --mem 4000 -t 0-06:00 matlab

In this case, we've asked for more memory because of the larger MATLAB footprint. The `--x11-first` option allows XWindows to operate between the login and compute nodes. The `interact` partition requires that you actually interact with the session. If you go more than an hour without any kind of input, it will assume that you have left the session and will terminate it. If you have interactive tasks that must stretch over days, you may be able to use the [GNU Screen](/resources/gnu-screen) utility to prevent the termination of a session. 

## Remote desktop access

As described in the [Access & Login](/resources/access-and-login/#Consider_an_NX_remote_desktop_for_graphical_applications_like_Matlab_and_RStudio) page, you can connect to the Odyssey system through NX-based remote desktops. Remote desktop access is particularly useful for heavy client applications like Matlab, SAS, and Spyder where the performance of X11 forwarding is poor. Once you have connected via NX, though, you should start an interactive session or run batch jobs. The `rcnx*` and `holynx*` servers are just like Odyssey login nodes and cannot support direct computation. 

<figure>
	<a class="img" href="/docs/images/nx-interactive-session.png">
    		<img class="img-responsive" src="/docs/images/nx-interactive-session.png"></img>
	</a>
    <figcaption>Run an interactive session before starting your application.</figcaption>
</figure>


## Slurm partitions 
*Partition* is the term that Slurm uses for queues. Partitions can be thought of as a set of resources and parameters around their use.

#### general
The `general` partition has a maximum run time of 7 days. Serial, parallel, and interactive jobs are permitted on this queue, and this is the most appropriate location for MPI jobs. This queue is governed by backfill and FairShare (explained below). 

The `general` partition is populated with hardware that RC runs at the [MGHPCC data center](http://www.mghpcc.org/) in Holyoke, MA. This queue has 214 nodes connected by a FDR [InfiniBand (IB)](http://en.wikipedia.org/wiki/InfiniBand) fabric, where each node configured with 4 AMD Opteron _[Abu Dhabi](http://en.wikipedia.org/wiki/List_of_AMD_Opteron_microprocessors#Opteron_6300-series_.22Abu_Dhabi.22_.2832_nm.29)_ CPUs, 256 GB of RAM, and 250 GB of local scratch space. Each AMD CPU has 8 Floating Point Units (FPU), 16 Integer Cores (IC), and 16 MB of cache. Thus, the entire system allocated to this partition has 13686 integer cores and 54 TB of RAM available for use.

When submitting MPI jobs on the `general` partition, it is advisable to use the `--contiguous` option for best communication performance.  Though all of the nodes are connected by Infiniband fabric, there are multiple switches routing the MPI traffic.  The `--contiguous` option will ensure that the jobs are run on nodes connected by the same switch.

#### unrestricted
Serial and parallel (including MPI) jobs are permitted on this partition and no restriction on run time. Given this, there is no guarantee of 100% uptime. Running on this partition is done at the users own risk. Users should understand that if the queue is full it could take weeks or up to months for your job to be scheduled to run. 

`unrestricted` is made up of 8 nodes (512 integer cores) of the same configuration as above for the `general` partition.

#### interact
This partition is dedicated for interactive (foreground / live) work and for testing (interactively) code before submitting in batch and scaling. Small numbers (1 to 5) of serial and parallel jobs with small resource requirements (RAM/cores) are permitted on this partition; large numbers of interactive jobs or those requiring large resource requirements should really be done on another partition. 

This partition is made up of 8 nodes of the same configuration as above for the general partition. This smaller, 512 integer core queue has a 3-day maximum run time.

#### serial_requeue
This partition is appropriate for single core (serial) jobs or jobs that require up to 8 cores for small periods of time (less than 1 day). The maximum runtime for this queue is 7 days. MPI jobs are not appropriate for this partition. As this partition is made up of an assortment of nodes owned by other groups in addition to the general nodes, jobs in this partition may be killed but automatically requeued if a higher priority job (e.g. the job of a node owner) comes in. Because `serial_requeue` takes advantage of slack time in owned partitions, times in the PENDING state can potentially be much shorter than the `general` partition. 

Since jobs may be killed, requeued, and run a 2nd time, ensure that the jobs are a good match for this partition. For example, jobs that append output would not be good for `serial_requeue` unless the data files were zeroed out at the start to ensure output from a previous (killed) run was removed. Also, to ensure your job need not redo all its compute again, it would be advisable to have breakpoints or branching instructions to bypass parts of work that have already been completed.

#### bigmem
This partition should be used for large memory work requiring greater than 250 GB RAM per job, like genome / transcript assemblies. There is no time limit for work here, and access to this partition must be specifically requested. MPI or low memory work is not appropriate for the this partition, and inappropriate jobs may be terminated without warning. This partition has an allocation of 8 nodes with 512 GB of RAM

#### gpu
This 1 node partition is for individuals wishing to test GPGPU resources. One will need to include `#SBATCH --gres=gpu:n` where n=1-8 in your Slurm submission scripts.  This 1 node has 24 cores and is equipped with 8 x NVidia Tesla K20Xm.  

There are private partitions that may have more GPU resources. See our [GPU Computing]({filename}/gpgpu-computing-on-odyssey.html) doc for more info.


##Storage on Odyssey
Odyssey partitions have many owned and general purpose file systems attached for use. However, for best performance please use the `regal` storage found at `/n/regal`. This is a [Lustre](http://en.wikipedia.org/wiki/Lustre_(file_system)) file system with 1.2 PB of storage and connected via Infiniband fabric. This space is available from all compute nodes. There are no quotas on this space, but there is a 90 day retention policy on the space. If you have not moved your data after 90 days it will be deleted to make space for other users. Please use `regal` only for reading and writing data from the cluster. Please create a subdirectory in your lab group's folder here under `/n/regal/`; please contact [RCHelp](http://portal.rc.fas.harvard.edu) if one does not yet exist.

## A number of factors, including _fair-share_ are used for job scheduling
We use a multifactor method of job scheduling on Odyssey. Job priority is assigned by a combination of fair-share, partition priority, and length of time a job has been sitting in the queue. The priority of the queue is the highest factor in the job priority calculation. For certain queues this will cause jobs on lower priority queues which overlap with that queue to be requeued. 

The second most important factor is fair-share score. You can find a description of how Slurm calculates Fair-share [here](http://Slurm.schedmd.com/priority_multifactor.html#fairshare). 

The third most important is how long you have been sitting in the queue. The longer your job sits in the queue the higher its priority grows. If everyone’s priority is equal then FIFO is the scheduling method. If you want to see what your current priority is just do `sprio -j JOBID` which will show you the calculation it does to figure out your job priority. If you do `sshare -u USERNAME` you can see your current fair-share and usage. We also have backfill turned on. This allows for jobs which are smaller to sneak in while a larger higher priority job is waiting for nodes to free up. If your job can run in the amount of time it takes for the other job to get all the nodes it needs, Slurm will schedule you to run during that period. This means knowing how long your code will run for is very important and must be declared if you wish to leverage this feature. Otherwise the scheduler will just assume you will use the maximum allowed time for the partition when you run. 

## Troubleshooting and common problems 
A variety of problems can arise when running jobs on Odyssey. Many are related to resource mis-allocation, but there are other common problems as well

<table>
	<tbody>
	<tr>
		<th style="width: 30%">Error</th>
		<th>Likely cause</th>
	</tr>
	<tr>
		<td><code>JOB &lt;jobid&gt; CANCELLED AT &lt;time&gt; DUE TO TIME LIMIT</code></td>
		<td>You did not specify enough time in your batch submission script. The <code>-t</code> option sets time in minutes or can also take <code>D-HH:MM</code> form (<code>0-12:30</code> for 12.5 hours)</td>
	</tr>
	<tr>
		<td><code>Job &lt;jobid&gt; exceeded &lt;mem&gt; memory limit, being killed</code></td>
		<td>Your job is attempting to use more memory than you've requested for it. Either increase the amount of memory requested by <code>--mem</code> or <code>--mem-per-cpu</code> or, if possible, reduce the amount your application is trying to use. For example, many Java programs set heap space using the <code>-Xmx</code> JVM option. This could potentially be reduced. For jobs that require truly large amounts of memory (>256 Gb), you may need to use the <code>bigmem</code> Slurm partition. Genome and transcript assembly tools are commonly in this camp.</td>
	</tr>
	<tr>
		<td><code>Slurm_receive_msg: Socket timed out on send/recv operation</code></td>
		<td>This message indicates a failure of the Slurm controller. Though there are many possible explanations, it is generally due to an overwhelming number of jobs being submitted, or, occasionally, finishing simultaneously. If you want to figure out if Slurm is working use the <code>sdiag</code> command. <code>sdiag</code> should respond quickly in these situations and give you an idea as to what the scheduler is up to.</td>
	</tr>
	<tr>
		<td><code>JOB &lt;jobid&gt; CANCELLED AT &lt;time&gt; DUE TO NODE FAILURE</code></td>
		<td>This message may arise for a variety of reasons, but it indicates that the host on which your job was running can no longer be contacted by Slurm.</td>
	</tr>
	</tbody>
</table>

## Using MPI
MPI (Message Passing Interface) is a standard that supports communication between separate processes, allowing parallel programs to simulate a large common memory space. OpenMPI](https://portal.rc.fas.harvard.edu/apps/modules/openmpi) and [MVAPICH2](https://portal.rc.fas.harvard.edu/apps/modules/mvapich2) are available as modules on Odyssey as well as an [Intel specific library](https://portal.rc.fas.harvard.edu/apps/modules/impi).  

As described in the [Helmod documentation]({filename}/software-on-odyssey.html), MPI libraries are a special class of module, called "Comp", that is compiler dependent.  To load an MPI library, load the compiler first.


    :::shell-session
    $ module load intel/15.0.0-fasrc01 openmpi/1.10.0-fasrc01

Once an MPI module is loaded, applications built against that library are made available.  This dynamic loading mechanism prevents conflicts that can arise between compiler versions and MPI library flavors. 

An example MPI script with comments is shown below:

    :::bash
    #!/bin/bash  
    #SBATCH -n 128             # Number of cores 
    #SBATCH -t 5               # Runtime in minutes 
    #SBATCH -p general         # Partition to submit to 
    #SBATCH --contiguous       # Ensure that all of the cores are on the same Infiniband network
    #SBATCH --mem-per-cpu=100  # Memory per cpu in MB (see also --mem) 
      
    module load intel/15.0.0-fasrc01 openmpi/1.10.0-fasrc01 
    module load MYPROGRAM
    mpirun -np 128 MYPROGRAM > output.txt 2> errors.txt

There are a number of important aspects to an MPI Slurm job.

* MPI jobs must be run on a partition that supports MPI interconnects.  `general`, `bigmem`,`unrestricted` are MPI-enabled, but `serial_requeue` includes non MPI resources.
* The `--contiguous` option should be used to ensure that all cores are on the same Infiniband switch
* Memory should be allocated with the `--mem-per-cpu` option instead of `--mem` so that memory matches core utilization.
* The `-np` option for mpirun or mpiexec (when these runners are used) should be compatible with the number of cores being requested in the `--mem-per-cpu` option. 
* The application must be MPI-enabled.  Applications cannot take advantage of MPI parallelization unless the source code is specifically built for it.  All such applications in the Helmod module system can only be loaded if an MPI library is loaded first. 


## Job arrays

Slurm allows you to submit a number of "near identical" jobs simultaneously in the form of a job array. To take advantage of this, you will need a set of jobs that differ only by an "index" of some kind. For example, say that you would like to run `tophat`, a splice-aware transcript-to-genome mapping tool, on 30 separate transcript files named `trans1.fq`, `trans2.fq`, `trans3.fq`, etc. First, construct a Slurm batch script, called `tophat.sh`, using special Slurm job array variables:

    :::bash
    #!/bin/bash  
    #SBATCH -J tophat                  # A single job name for the array 
    #SBATCH -n 1                       # Number of cores 
    #SBATCH -N 1                       # All cores on one machine 
    #SBATCH -p serial_requeue          # Partition 
    #SBATCH --mem 4000                 # Memory request (4Gb)
    #SBATCH -t 0-2:00                  # Maximum execution time (D-HH:MM)
    #SBATCH -o tophat_%A_%a.out        # Standard output 
    #SBATCH -e tophat_%A_%a.err        # Standard error  
     
    module load tophat/2.0.13-fasrc02
    tophat /n/regal/informatics_public/ref/ucsc/Mus_musculus/mm10/chromFa trans"${SLURM_ARRAY_TASK_ID}".fq

Then launch the batch process using the `--array` option to specify the indexes.

    :::shell-session
    sbatch --array=1-30 tophat.sh

In the script, two types of substitution variables are available when running job arrays. The first, `%A` and `%a`, represent the job ID and the job array index, respectively. These can be used in the sbatch parameters to generate unique names. The second, `SLURM_ARRAY_TASK_ID`, is a bash environment variable that contains the current array index and can be used in the script itself. In this example, 30 jobs will be submitted each with a different input file and different standard error and standard out files. More detail can be found on the [Slurm job array documentation page](http://www.schedmd.com/Slurmdocs/job_array.html). 


## Checkpointing
[Slurm supports checkpointing a job](http://Slurm.schedmd.com/checkpoint_blcr.html)- stopping a job in the middle of processing and restarting from where it left off- using the [BLCR framework](https://upc-bugs.lbl.gov/blcr/doc/html/BLCR_Users_Guide.html). This subsystem only works if your application has been built to support it, though this may be as simple as linking in the appropriate libraries. 

## Job dependencies
Many scientific computing tasks consist of serial processing steps. A genome assembly pipeline, for example, may require sequence quality trimming, assembly, and annotation steps that must occur in series. Launching each of these jobs without manual intervention can be done by repeatedly polling the controller with `squeue` / `sacct` until the State is COMPLETED. However, it's much more efficient to let the Slurm controller handle this using the `--dependency` option. 

<figure>
	<a class="img" href="/docs/images/job-dependency.png">
    		<img class="img-responsive" src="/docs/images/job-dependency.png"></img>
	</a>
    <figcaption>Example of submitting a job with a dependency on a previous job.</figcaption>
</figure>

When submitting a job, specify a combination of "dependency type" and job ID in the `--dependency` option. `afterok` is an example of a dependency type that will run the dependent job if the parent job completes successfully (state goes to COMPLETED). The full list of dependency types can be found on the Slurm doc site in the [man page for sbatch](http://slurm.schedmd.com/sbatch.html). 
