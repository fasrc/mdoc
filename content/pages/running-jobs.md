Title: Running Jobs
Date: 2015-11-10
Category: Guides
Tags: Odyssey, Slurm
Summary: This guide will provide you with details about how to run Slurm jobs on the Odyssey cluster.

##The Odyssey cluster uses SLURM to manage jobs## [SLURM](http://slurm.schedmd.com) is a queue management system and stands for Simple Linux Utility for Resource Management. SLURM was developed at the Lawrence Livermore National Lab and currently runs some of the largest compute clusters in the world. SLURM replaces the commercial [LSF system](http://www-03.ibm.com/systems/technicalcomputing/platformcomputing/products/lsf/) as the primary job manager on Odyssey. SLURM is similar in many ways to LSF or most other queue systems. You write a batch script then submit it to the queue manager. The queue manager then schedules your job to run on the queue (or partition in SLURM parlance) that you designate. Below we will provide an outline of how to submit jobs to SLURM, how SLURM decides when to schedule your job and how to monitor progress. SLURM has a number of features that make it more suited to our environment than LSF:

*   _Kill and Requeue_ SLURM’s ability to kill and requeue is superior to that of LSF. It waits for jobs to be cleared before scheduling the high priority job. It also does kill and requeue on memory rather than just on core count.
*   _Memory_ Memory requests are sacrosanct in SLURM. Thus the amount of memory you request at run time is guaranteed to be there. No one can infringe on that memory space and you cannot exceed the amount of memory that you request.
*   _Accounting Tools_ SLURM has a back end database which stores historical information about the cluster. This information can be queried by the users who are curious about how much resources they have used.

## General SLURM documentation is widely available. ## The primary source for documentation on SLURM usage and commands can be found at the [SLURM site](http://slurm.schedmd.com/documentation.html). If you Google for SLURM questions, you'll often see the Lawrence Livermore pages as the top hits, but these tend to be outdated. A great way to get details on the SLURM commands is the man pages available from the Odyssey cluster. For example, if you type the following command:

<div class="rc-code">man sbatch</div>

you'll get the manual page for the sbatch command.

## Odyssey jobs are generally run from the command line

Once you've gone through the account setup procedure and [obtained a suitable terminal application](/resources/access-and-login/#Use_any_common_terminal_application_for_command_line_access), you can login to the Odyssey system via ssh

<div class="rc-code">ssh <USERNAME>@login.rc.fas.harvard.edu</div>

where is the RC login you received from the account request tool. This is generally not the same as your HUIT machine login and is not your Harvard ID. Odyssey computers run the CentOS 6 version of the Linux operating system and commands are run under the "bash" shell. There are a number of Linux and bash [references](http://www.gnu.org/software/bash/manual/bashref.html), [cheat sheets](http://cli.learncodethehardway.org/bash_cheat_sheet.pdf) and [tutorials](http://www.tldp.org/LDP/Bash-Beginners-Guide/html/) available on the web. RC's own [training slides](https://software.rc.fas.harvard.edu/training/intro_unix/latest/) are also available. ## A `module` system is used for enabling applications ## Because of the diversity of investigations currently supported by FAS, thousands of applications and libraries are supported on the Odyssey cluster. Technically, it is impossible to include all of these tools in every user's environment. The Linux [module system](http://modules.sourceforge.net) is used to enable subsets of these tools for a particular user's computational needs. **Please note that we are switching to the new `lmod` module system. Please see the most current information on our [Software on Odyssey](/resources/documentation/software-on-odyssey/) pages.** A `module load` command enables a particular application in the environment, mainly by adding the application to your PATH variable. For example, to enable the currently supported R package:

<div class="rc-code">module load centos6/R-3.0.2</div>

[![module load R](/wp-content/uploads/2014/03/module-load-R.png)](/wp-content/uploads/2014/03/module-load-R.png)*module load R* Loading more complex modules can affect a number of environment variables including `PYTHONPATH`, `LD_LIBRARY_PATH`, `PERL5LIB`, etc. Modules may also load dependencies. An application that uses Java may load the module for the appropriate Java interpreter. [![Load of module trinityrnaseq and changes to the environment](/wp-content/uploads/2014/03/environment-after-trinity-load.png)](/wp-content/uploads/2014/03/environment-after-trinity-load.png) *Loading modules will change your bash environment* To determine what has been loaded in your environment, the `module list` command will print all loaded modules. [![module list command shows all loaded modules](/wp-content/uploads/2014/03/module-list.png)](/wp-content/uploads/2014/03/module-list.png)*`module list` command shows all loaded modules* The `module purge` command will remove all currently loaded modules. This is particularly useful if you have to run incompatible software (e.g. python 2.x or python 3.x). The `module unload` command will remove a specific module and any dependencies that were loaded with the module. [![module unload commands removes a module and it's dependencies from your environment.](/wp-content/uploads/2014/03/module-unload.png)](/wp-content/uploads/2014/03/module-unload.png)*`module unload` command removes a module and dependencies from your environment* Finding the modules that are appropriate for your needs can be done in a couple of different ways. First, there is a <a>page on this site</a> that will allow you to browse and search (via your browser's page search functionality) the list of modules that have been deployed to Odyssey. Second, the `module avail` command can be used along with a pattern match of the output. `module avail` by itself will list every module deployed on Odyssey, so a tool like `grep` can be used to narrow it down. For example,

<div class="rc-code">module avail 2>&1 | grep -i trinity</div>

will find the Trinity module. RC has developed a module system enhancement called `modulesearch` that will allow you to search through not just module names, but also their description strings. The output of a search includes a blurb about the tool. [![modulesearch looks through module names and descriptions for a string.](/wp-content/uploads/2014/03/modulesearch.png)](/wp-content/uploads/2014/03/modulesearch.png)*Use `modulesearch` to look through names and descriptions* As the screenshot above demonstrates, there may be multiple versions of a module. Multiple versions may exist for a variety of reasons:

*   Multiple versions of the software or library are needed for different applications
*   High performance applications may need to be built with specially tuned compilers (e.g. intel as opposed to gcc)
*   Support for parallel execution (openmpi or mvapich2) may need to be explicitly constructed.
*   Newer builds (`centos6/`) should be used for new code, but older versions (`hpc/`) are maintained for backward compatibility.

Be careful to select the appropriate module. Mixing tools between intel and gcc compilers, for example, can result in code failures. By default, the `centos6/*` modules should be used. modules in the `bio/` or `hpc/` namespace should be avoided if possible since they will not be supported in the future. If you commonly use the same tools each time you login to Odyssey, `module load` statements can be added to your `.bashrc` file. But _**Caveat Emptor!**_ *Loading too many modules, especially ones that load others automatically, could introduce version or library conflicts and cause your code/jobs to fail. So use this sparingly!* One example is:

<div class="rc-code"># .bashrc   # Source global definitions if [ -f /etc/bashrc ]; then . /etc/bashrc fi   # User specific aliases and functions module load centos6/python-2.7.3 >& /dev/null module load centos6/ipython-0.13.2_python-2.7.3 >& /dev/null</div>

The `>& /dev/null` component to the statement suppresses the output of the module statement.

## Summary of SLURM commands

The table below shows a summary of SLURM commands, along with LSF equivalents and an example. These commands are described in more detail below along with links to the SLURM doc site.

<table>

<tbody>

<tr>

<th>SLURM</th>

<th>LSF</th>

<th>SLURM Example</th>

</tr>

<tr>

<td>Submit a batch serial job</td>

<td>sbatch</td>

<td>bsub</td>

<td>`sbatch runscript.sh`</td>

</tr>

<tr>

<td>Run a script interatively</td>

<td>srun</td>

<td>bsub -K</td>

<td>`srun --pty -p interact -t 10 --mem 1000 /bin/bash /bin/hostname`</td>

</tr>

<tr>

<td>Kill a job</td>

<td>scancel</td>

<td>bkill</td>

<td>`scancel 999999`</td>

</tr>

<tr>

<td>View status of queues</td>

<td>squeue</td>

<td>bqueues</td>

<td>`squeue -u akitzmiller`</td>

</tr>

<tr>

<td>Check current job by id</td>

<td>sacct</td>

<td>bjobs</td>

<td>`sacct -j 999999`</td>

</tr>

</tbody>

</table>

## General SLURM resources

Though SLURM is not as common as SGE or LSF, documentation is readily available.

*   [Common SLURM commands](/resources/documentation/convenient-slurm-commands/)
*   [Official SLURM web site](http://slurm.schedmd.com)
*   [Official SLURM documentation](http://slurm.schedmd.com/documentation.html)
*   [SLURM tutorial videos](http://slurm.schedmd.com/tutorials.html)
*   [LLNL quick start user guide](https://computing.llnl.gov/linux/slurm/quickstart.html)

## Submitting batch jobs using the `sbatch` command

The main way to run jobs on Odyssey is by submitting a script with the sbatch command. The command to submit a job is as simple as:

<div class="rc-code">sbatch runscript.sh</div>

The commands specified in the runscript.sh file will then be run on the first available compute node that fits the resources requested in the script. sbatch returns immediately after submission; commands are not run as foreground processes and won't stop if you disconnect from Odyssey. A typical submission script, in this case using the `hostname` command to get the computer name, will look like this:

<div class="rc-code">#!/bin/bash # #SBATCH -n 1 # Number of cores #SBATCH -N 1 # Ensure that all cores are on one machine #SBATCH -t 0-00:05 # Runtime in D-HH:MM #SBATCH -p serial_requeue # Partition to submit to #SBATCH --mem=100 # Memory pool for all cores (see also --mem-per-cpu) #SBATCH -o hostname.out # File to which STDOUT will be written #SBATCH -e hostname.err # File to which STDERR will be written #SBATCH --mail-type=END # Type of email notification- BEGIN,END,FAIL,ALL #SBATCH --mail-user=ajk@123.com # Email to which notifications will be sent   hostname</div>

In general, the script is composed of 3 parts- the `#!/bin/bash` line allows the script to be run as a bash script; the `#SBATCH` lines are technically bash comments, but they set various parameters for the SLURM scheduler; the command line itself. The `#SBATCH` lines shown above set key parameters. _N.B. It is important to keep all `#SBATCH` lines together and at the top of the script; no bash code or variables settings should be done until after the `#SBATCH` lines._ The SLURM system copies many environment variables from your current session to the compute host where the script is run including `PATH` and your current working directory. As a result, you can specify files relative to your current location (e.g. `./project/myfiles/myfile.txt`).

<dl>

<dt>`#SBATCH -n 1`</dt>

<dd>This line sets the number of cores that you're requesting. Make sure that your tool can use multiple cores before requesting more than one. If this parameter is omitted, SLURM assumes `-n 1`.</dd>

</dl>

<dl>

<dt>`#SBATCH -N 1`</dt>

<dd>This line requests that the cores are all on node. Only change this to >1 if you know your code uses a message passing protocol like MPI. SLURM makes no assumptions on this parameter -- if you request more than one core (-n > 1) and your forget this parameter, your job may be scheduled across nodes; and unless your job is MPI (multinode) aware, your job will run slowly, as it is oversubscribed on the master node and wasting resources on the other(s).</dd>

<dt>`#SBATCH -t 5`</dt>

<dd>This line specifies the running time for the job in minutes. You can also the convenient format D-HH:MM. If your job runs longer than the value you specify here, it will be cancelled. Jobs have a maximum run time of 7 days on Odyssey, though extensions can be done. There is no penalty for over-requesting time. **NOTE!** If this parameter is omitted on any partition, the your job will be given the default of 10 minutes.</dd>

<dt>`#SBATCH -p serial_requeue`</dt>

<dd>This line specifies the SLURM partition (AKA queue) under which the script will be run. The serial_requeue partition is good for routine jobs that can handle being occasionally stopped and restarted. PENDING times are typically short for this queue. See the [partitions description below](#SLURM_partitions) for more information</dd>

<dt>`#SBATCH --mem=100`</dt>

<dd>The Odyssey cluster requires that you specify the amount of memory (in MB) that you will be using for your job. Accurate specifications allow jobs to be run with maximum efficiency on the system. There are two main options, `--mem-per-cpu` and `--mem`. The `--mem` option specifies the total memory pool for one or more cores, and is the recommended option to use. If you must do work across multiple compute nodes (e.g. MPI code), then you must use the `--mem-per-cpu` option, as this will allocate the amount specified for each of the cores you're requested, whether it is on one node or multiple nodes. If this parameter is omitted, the smallest amount is allocated, usually 100 MB. And chances are good that your job will be killed as it will likely go over this amount.</dd>

<dt>`#SBATCH -o hostname.out`</dt>

<dd>This line specifies the file to which standard out will be appended. If a relative file name is used, it will be relative to your current working directory. If this parameter is omitted, any output will be directed to a file named slurm-JOBID.out in the current directory.</dd>

<dt>`#SBATCH -e hostname.err`</dt>

<dd>This line specifies the file to which standard error will be appended. SLURM submission and processing errors will also appear in the file. If this parameter is omitted, any output will be directed to a file named slurm-JOBID.out in the current directory.</dd>

<dt>`#SBATCH --mail-type=END`</dt>

<dd>Because jobs are processed in the "background" and can take some time to run, it is useful send an email message when the job has finished (--mail-type=END). Email can also be sent for other processing stages (START, FAIL) or at all of the times (ALL)</dd>

<dt>`#SBATCH --mail-user=ajk@123.com`</dt>

<dd>The email address to which the --mail-type messages will be sent.</dd>

</dl>

### It is important to accurately request resources, **especially memory**

Odyssey is a large, shared system that must have an accurate idea of the resources your program(s) will use so that it can effectively schedule jobs. If insufficient memory is allocated, your program may crash (often in an unintelligible way); if too much memory is allocated, resources that could be used for other jobs will be wasted. Additionally, your "fairshare", a number used in calculating the priority of your job for scheduling purposes, can be adversely affected by over-requesting. Therefore it is important to be as accurate as possible when requesting cores (`-n`) and memory (`--mem` or `--mem-per-cpu`). Many scientific computing tools can take advantage of multiple processing cores, but many cannot. A typical R script, for example will not use multiple cores. On the other hand, RStudio, a graphical console for R is a Java program that is improved substantially by using multiple cores. Or, you can use the [Rmpi](https://www.sharcnet.ca/help/index.php/Using_R_and_MPI) package and spawn "slaves" that correspond to the number of cores you've selected. The distinction between `--mem` and `--mem-per-cpu` is important when running multi-core jobs (for single core jobs, the two are equivalent). `--mem` sets total memory across all cores, while `--mem-per-cpu` sets the value for each requested core. If you request two cores (`-n 2`) and 4 Gb with `--mem`, each core will receive 2 Gb RAM. If you specify 4 Gb with `--mem-per-cpu`, each core will receive 4 Gb for a total of 8 Gb. ## Monitoring job progress with squeue and sacct ## `squeue` and `sacct` are two different commands that allow you to monitor job activity in SLURM. `squeue` is the primary and most accurate monitoring tool since it queries the SLURM controller directly. `sacct` gives you similar information for running jobs, and can also report on previously finished jobs, but because it accesses the SLURM database, there are some circumstances when the information is not in sync with `squeue`. Running `squeue` without arguments will list all currently running jobs. It is more common, though to list jobs for a particular user (like yourself) using the `-u` option...

<div class="rc-code">squeue -u akitzmiller</div>

or for a particular job

<div class="rc-code">squeue -j 9999999</div>

If you include the `-l` option (for "long" output) you can get useful data, including the running state of the job. [![squeue "long" output using username (-u) and job id (-j) filters](/wp-content/uploads/2014/03/squeue.png)](/wp-content/uploads/2014/03/squeue.png) *`squeue` long output using username (`-u`) and job id (`-j`) filters* The [squeue man page](http://slurm.schedmd.com/squeue.html) has a complete description of the tool options. The `sacct` command also provides details on the state of a particular job. An `squeue`-like report on a single job is a simple command.

<div class="rc-code">sacct -j 9999999</div>

However `sacct` can provide much more detail as it has access to many of the resource accounting fields that SLURM uses. For example, to get a detailed report on the memory usage for today's jobs for user `cwill`: [![Example of using sacct for detailed job information](/wp-content/uploads/2014/03/sacct.png)](/wp-content/uploads/2014/03/sacct.png) *Example of using `sacct` for detailed job information* Both tools provide information about the job State. This value will typically be one of PENDING, RUNNING, COMPLETED, CANCELLED, and FAILED.

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

## Killing jobs with scancel ## If for any reason, you need to kill a job that you've submitted, just use the `scancel` command with the job ID.

<div class="rc-code">scancel 9999999</div>

If you don't keep track of the job ID returned from `sbatch`, you should be able to find it with the `squeue -u` command described above.

## Interactive jobs and srun

Though batch submission is the best way to take full advantage of the compute power in Odyssey, foreground, interactive jobs can also be run. These can be useful for things like:

*   Iterative data exploration at the command line
*   RAM intensive graphical applications like MATLAB or SAS.
*   Interactive "console tools" like R and iPython
*   Significant software development and compiling efforts

An interactive job differs from a batch job in two important aspects: 1) the partition to be used is the `interact` partition and, 2) jobs should be initiated with the `srun` command instead of `sbatch`. This command:

<div class="rc-code">srun -p interact --pty --mem 500 -t 0-06:00 /bin/bash</div>

will start a command line shell (`/bin/bash`) on the interactive queue with 500 MB of RAM for 6 hours; 1 core on 1 node is assumed as these parameters (`-n 1 -N 1`) were left out. When the interactive session starts, you will notice that you are no longer on a login node, but rather one of the compute nodes dedicated to this queue. The `--pty` option allows the session to act like a standard terminal. In a pinch, you can also run an application directly *though this is discouraged due to problems setting up bash environment variables*. After loading a module for MATLAB, you can start the application with the following command:

<div class="rc-code">srun -p interact --pty --x11=first --mem 4000 -t 0-06:00 matlab</div>

In this case, we've asked for more memory because of the larger MATLAB footprint. The `--x11-first` option allows XWindows to operate between the login and compute nodes. The `interact` partition requires that you actually interact with the session. If you go more than an hour without any kind of input, it will assume that you have left the session and will terminate it. If you have interactive tasks that must stretch over days, you may be able to use the [GNU Screen](/resources/gnu-screen) utility to prevent the termination of a session. ## Remote desktop access ## As described in the [Access & Login](/resources/access-and-login/#Consider_an_NX_remote_desktop_for_graphical_applications_like_Matlab_and_RStudio) page, you can connect to the Odyssey system through NX-based remote desktops. Remote desktop access is particularly useful for heavy client applications like Matlab, SAS, and Spyder where the performance of X11 forwarding is poor. Once you have connected via NX, though, you should start an interactive session or run batch jobs. The `rcnx*` servers are just like Odyssey login nodes and cannot support direct computation. [![Run an interactive session before starting your application.](/wp-content/uploads/2014/02/nx-run-interactive-job.png)](/wp-content/uploads/2014/02/nx-run-interactive-job.png) *Run an interactive session before starting your application* ## SLURM partitions ## _Partition_ is the term that SLURM uses for queues. Partitions can be thought of as a set of resources and parameters around their use.

<dl>

<dt>general</dt>

<dd>The `general` partition has a maximum run time of 7 days. Serial, parallel, and interactive jobs are permitted on this queue, and this is the most appropriate location for MPI jobs. This queue is governed by backfill and FairShare (explained below). *Technical:* This hits the hardware that RC runs at the [MGHPCC data center](http://www.mghpcc.org/) in Holyoke, MA. This queue has 214 nodes connected by a FDR [InfiniBand (IB)](http://en.wikipedia.org/wiki/InfiniBand) fabric, where each node configured with 4 AMD Opteron _[Abu Dhabi](http://en.wikipedia.org/wiki/List_of_AMD_Opteron_microprocessors#Opteron_6300-series_.22Abu_Dhabi.22_.2832_nm.29)_ CPUs, 256 GB of RAM, and 250 GB of local scratch space. Each AMD CPU has 8 Floating Point Units (FPU), 16 Integer Cores (IC), and 16 MB of cache. Thus, the entire system allocated to the `general` partition has 13686 integer cores and 54 TB of RAM available for use.</dd>

<dt>unrestricted</dt>

<dd>Serial and parallel (including MPI) jobs are permitted on this partition and no restriction on run time. Given this, there is no guarantee of 100% uptime. Running on this queue is done at the users own risk. Users should understand that if the queue is full it could take weeks or up to months for your job to be scheduled to run. *Technical:* This partition is made up of 8 nodes (512 integer cores) of the same configuration as above for the `general` partition.</dd>

<dt>interactive</dt>

<dd>This partition is dedicated for interactive (foreground / live) work and for testing (interactively) code before submitting in batch and scaling. Small numbers (1 to 5) of serial and parallel jobs with small resource requirements (RAM/cores) are permitted on this partition; large numbers of interactive jobs or those requiring large resource requirements should really be done on another partition. *Technical:* This partition is made up of 8 nodes of the same configuration as above for the `general` partition. This smaller, 512 integer core queue has a 3-day maximum run time.</dd>

<dt>serial_requeue</dt>

<dd>This partition is appropriate for single core (serial) jobs or jobs that require up to 8 cores for small periods of time (less than 1 day). The maximum runtime for this queue is 7 days. MPI jobs are not appropriate for this partition. As this partition is made up of an assortment of nodes owned by other groups in addition to the `general` nodes, jobs in this partition may be killed but automatically requeued if a higher priority job (e.g. the job of a node owner) comes in. Because `serial_requeue` takes advantage of slack time in owned partitions, `PENDING` times can potentially be much shorter than the `general` partition. Since jobs may be killed, requeued, and run a 2nd time, ensure that the jobs are a good match for this partition. For example, jobs that append output would not be good for `serial_requeue` unless the data files were zeroed out at the start to ensure output from a previous (killed) run was removed. Also, to ensure your job need not redo all its compute again, it would be advisable to have breakpoints or branching instructions to bypass parts of work that have already been completed. NOTE: Our deprecated `holyscratch` file system is not mounted on all `serial_requeue` hosts. [Holyscratch](/resources/odyssey-storage/) is one of the large, networked temporary file systems on Odyssey, but, due to technical limitations cannot be mounted on all of the hosts in this partition. `/n/regal` is a better option for scratch space when using this partition.</dd>

<dt>bigmem</dt>

<dd>This partition should be used for large memory work requiring greater than 250 GB RAM per job, like genome / transcript assemblies. There is no time limit for work here, and access to this partition must be specifically requested. MPI or low memory work is not appropriate for the this partition, and inappropriate jobs may be terminated without warning. *Technical:* This partition has an allocation of 8 nodes with 512 GB of RAM</dd>

<dt>gpu</dt>

<dd>This 1 node partition is for individuals wishing to use GPGPU resources. One will need to include `#SBATCH --gres=gpu:n` where n=1-8 in your SLURM submission scripts. *Technical:* This 1 node has 24 cores and is equipped with 8 x NVidia Tesla K20Xm. NOTE: There are private partitions that may have more GPU resources. See our [GPU Computing](/resources/documentation/gpgpu-computing-on-odyssey/) doc for more info.</dd>

</dl>

##Storage on Odyssey## Odyssey partitions have many owned and general purpose file systems attached for use. However, for best performance please use the `regal` storage found at `/n/regal`. This is a [Lustre](http://en.wikipedia.org/wiki/Lustre_(file_system)) file system with 1.2 PB of storage and connected via Infiniband fabric. This space is available from all compute nodes. There are no quotas on this space, but there is a 90 day retention policy on the space. If you have not moved your data after 90 days it will be deleted to make space for other users. Please use `regal` only for reading and writing data from the cluster. Please create a subdirectory in your lab group's folder here under `/n/regal/`; please contact [RCHelp](http://portal.rc.fas.harvard.edu) if one does not yet exist.

## A number of factors, including _fair-share_ are used for job scheduling

We use a multifactor method of job scheduling on Odyssey. Job priority is assigned by a combination of fair-share, partition priority, and length of time a job has been sitting in the queue. The priority of the queue is the highest factor in the job priority calculation. For certain queues this will cause jobs on lower priority queues which overlap with that queue to be requeued. The second most important factor is fair-share score. You can find a description of how SLURM calculates Fair-share [here](http://slurm.schedmd.com/priority_multifactor.html#fairshare). The third most important is how long you have been sitting in the queue. The longer your job sits in the queue the higher its priority grows. If everyone’s priority is equal then FIFO is the scheduling method. If you want to see what your current priority is just do `sprio -j JOBID` which will show you the calculation it does to figure out your job priority. If you do `sshare -u USERNAM`E you can see your current fair-share and usage. We also have backfill turned on. This allows for jobs which are smaller to sneak in while a larger higher priority job is waiting for nodes to free up. If your job can run in the amount of time it takes for the other job to get all the nodes it needs, SLURM will schedule you to run during that period. This means knowing how long your code will run for is very important and must be declared if you wish to leverage this feature. Otherwise the scheduler will just assume you will use the maximum allowed time for the partition when you run. ## Troubleshooting and common problems ## A variety of problems can arise when running jobs on Odyssey. Many are related to resource mis-allocation, but there are other common problems as well

<table>

<tbody>

<tr>

<th>Error</th>

<th>Likely cause</th>

</tr>

<tr>

<td>`JOB <jobid> CANCELLED AT <time> DUE TO TIME LIMIT`</td>

<td>You did not specify enough time in your batch submission script. The `-t` option sets time in minutes or can also take `D-HH:MM` form (`0-12:30` for 12.5 hours)</td>

</tr>

<tr>

<td>`Job <jobid> exceeded <mem> memory limit, being killed`</td>

<td>Your job is attempting to use more memory than you've requested for it. Either increase the amount of memory requested by `--mem` or `--mem-per-cpu` or, if possible, reduce the amount your application is trying to use. For example, many Java programs set heap space using the `-Xmx` JVM option. This could potentially be reduced. For jobs that require truly large amounts of memory (>256 Gb), you may need to use the `bigmem` SLURM partition. Genome and transcript assembly tools are commonly in this camp.</td>

</tr>

<tr>

<td>`slurm_receive_msg: Socket timed out on send/recv operation`</td>

<td>This message indicates a failure of the SLURM controller. Though there are many possible explanations, it is generally due to an overwhelming number of jobs being submitted, or, occasionally, finishing simultaneously. If you want to figure out if SLURM is working use the `sdiag` command. `sdiag` should respond quickly in these situations and give you an idea as to what the scheduler is up to.</td>

</tr>

<tr>

<td>`JOB <jobid> CANCELLED AT <time> DUE TO NODE FAILURE`</td>

<td>This message may arise for a variety of reasons, but it indicates that the host on which your job was running can no longer be contacted by SLURM.</td>

</tr>

</tbody>

</table>

## Using MPI

MPI (Message Passing Interface) is a standard that supports communication between separate processes, allowing parallel programs to simulate a large common memory space. Two implementations, OpenMPI and MVAPICH2 are available on Odyssey. These libraries can be loaded via the module system:

<div class="rc-code">module load centos6/openmpi-1.7.2_intel-13.0.079</div>

Note that the MPI module names also specify the compiler used to build them. It is important that the tools you are using have been built with the same compiler. If not, your job will fail. An example MPI script with comments is below:

<div class="rc-code">#!/bin/bash # #SBATCH -n 128 # Number of cores #SBATCH -t 5 # Runtime in minutes #SBATCH -p general # Partition to submit to #SBATCH --mem-per-cpu=100 # Memory per cpu in MB (see also --mem)   mpirun -np 128 MYPROGRAM > output.txt 2> errors.txt</div>

Notice that the number of processors requested by the `mpirun` command matches the number of cores requested for SLURM (`-n`). There is a little weirdness with Intel MPI (the version of MPI specifically built by Intel, not OpenMPI or MVAPICH) currently. Intel MPI doesn’t translate the SLURM host list properly. We have put together the script (`hostgen.sh`) below to fix this:

<div class="rc-code">#!/bin/bash   hostlist=$(scontrol show hostname $SLURM_JOB_NODELIST) rm -f hosts   for f in $hostlist do echo $f':64' >> hosts done</div>

This code generates a proper host list in to a file called `hosts` which can then be run by Intel MPI. So instead of the above batch script you will want to run:

<div class="rc-code">#!/bin/bash # #SBATCH -n 128 # Number of cores #SBATCH --ntasks-per-node=64 # run 64 cores/node (2 nodes) #SBATCH -t 5 # Runtime in minutes #SBATCH -p general # Partition to submit to #SBATCH --mem-per-cpu=1750 # Memory per cpu in MB (see also --mem)   ./hostgen.sh   mpirun -np 128 -f hosts MYPROGRAM > output.txt > errors.txt</div>

Make sure you run with 64 cores per node and also make sure to change the number after the colon in `hostgen.sh` to be the number of cpus per node.

## Job arrays

SLURM allows you to submit a number of "near identical" jobs simultaneously in the form of a job array. To take advantage of this, you will need a set of jobs that differ only by an "index" of some kind. For example, say that you would like to run `tophat`, a splice-aware transcript-to-genome mapping tool, on 30 separate transcript files named `trans1.fq`, `trans2.fq`, `trans3.fq`, etc. First, construct a SLURM batch script, called `tophat.sh`, using special SLURM job array variables:

<div class="rc-code">#!/bin/bash # #SBATCH -J tophat # A single job name for the array #SBATCH -n 1 # Number of cores #SBATCH -N 1 # All cores on one machine #SBATCH -p serial_requeue # Partition #SBATCH --mem 4000 # Memory request #SBATCH -t 0-2:00 # 2 hours (D-HH:MM) #SBATCH -o tophat_%A_%a.out # Standard output #SBATCH -e tophat_%A_%a.err # Standard error   tophat /n/scratch2/informatics/databases/Mus_musculus/UCSC/mm10/Sequence/BowtieIndex trans"${SLURM_ARRAY_TASK_ID}".fq</div>

Then launch the batch process using the `--array` option to specify the indexes.

<div class="rc-code">sbatch --array=1-30 tophat.sh</div>

In the script, two types of substitution variables are available when running job arrays. The first, `%A` and `%a`, represent the job ID and the job array index, respectively. These can be used in the sbatch parameters to generate unique names. The second, `SLURM_ARRAY_TASK_ID`, is a bash environment variable that contains the current array index and can be used in the script itself. In this example, 30 jobs will be submitted each with a different input file and different standard error and standard out files. More detail can be found on the [SLURM job array documentation page](http://www.schedmd.com/slurmdocs/job_array.html). ## Checkpointing ## [SLURM supports checkpointing a job](http://slurm.schedmd.com/checkpoint_blcr.html)- stopping a job in the middle of processing and restarting from where it left off- using the [BLCR framework](https://upc-bugs.lbl.gov/blcr/doc/html/BLCR_Users_Guide.html). This subsystem only works if your application has been built to support it, though this may be as simple as linking in the appropriate libraries. ## Job dependencies ## Many scientific computing tasks consist of serial processing steps. A genome assembly pipeline, for example, may require sequence quality trimming, assembly, and annotation steps that must occur in series. Launching each of these jobs without manual intervention can be done by repeatedly polling the controller with `squeue` / `sacct` until the State is COMPLETED. However, it's much more efficient to let the SLURM controller handle this using the `--dependency` option. [![Example of submitting a job with a dependency on a previous job.](/wp-content/uploads/2014/03/dependency_example.png)](/wp-content/uploads/2014/03/dependency_example.png) *Example of submitting a job with a dependency on a previous job* When submitting a job, specify a combination of "dependency type" and job ID in the `--dependency` option. `afterok` is an example of a dependency type that will run the dependent job if the parent job completes successfully (state goes to COMPLETED). The full list of dependency types can be found on the SLURM doc site in the [man page for sbatch](http://slurm.schedmd.com/sbatch.html). *[lastupdated]*