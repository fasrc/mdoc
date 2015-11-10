Title: Odyssey Quick Start Guide
Date: 2015-11-10
Category: Guides
Tags: Odyssey
Summary: This guide will provide you with the basic information needed to get up and running on Odyssey for simple command line access.

This guide will provide you with the basic information needed to get up and running on Odyssey for simple command line access. If you'd like more detailed information, each section has a link to fuller documentation

_If you were familiar with your legacy CentOS 5.7 and LSF environment, and are transitioning to CentOS 6.4 and SLURM, a.k.a. "Odyssey 2.0", please also see the [Odyssey 2.0 transition guide]({filename}/pages/odyssey-2-0-transition-faq/)_

### <span id="Get_an_Odyssey_account_using_the_account_request_tool">Get an Odyssey account using the [account request tool](https://account.rc.fas.harvard.edu/request/).</span>

Before you can access Odyssey you need to request a Research Computing account from the [account request tool](https://account.rc.fas.harvard.edu/request/). As you fill out the forms for the account request tool, make sure and select "Odyssey Cluster Use" from the list of services. Your account will be activated after a set of approvals are passed:

1.  RC checks the request and then approves it
2.  The PI is sent an email with a link to approve or reject the request
3.  Approved requests are then processed
4.  You receive a confirmation with instructions on getting started

### <span id="Setup_OpenAuth_for_two_factor_authentication">Setup OpenAuth for two factor authentication</span>

Once you have your new RC account, you will need to [obtain the OpenAuth tool](https://software.rc.fas.harvard.edu/oa/) for two-factor authentication. After installation, run OpenAuth to obtain the personalized verification code you will need to log in.

_See the [OpenAuth doc page]({filename}/pages/openauth) for details about how OpenAuth works and how to troubleshoot potential problems._

### <span id="Use_a_terminal_to_ssh_to_loginrcfasharvardedu">Use a terminal to ssh to login.rc.fas.harvard.edu</span>

For command line access to Odyssey, connect to login.rc.fas.harvard.edu using ssh. If you are running Linux or Mac OSX, open a terminal and type `ssh USERNAME@login.rc.fas.harvard.edu`, where USERNAME is the name you were assigned when you received your account. Enter the password you setup in the account request tool. When prompted for the Verification code, use the OpenAuth supplied number.

[![Logging in to Odyssey using two-factor authentication.  The OpenAuth application (upper right corner) displays the value to be used for the Verification code prompt.](/wp-content/uploads/2014/02/OpenAuth-verification-code.png)](/wp-content/uploads/2014/02/OpenAuth-verification-code.png)

Add `-Y` if you have an X11 server installed and desire graphics support (`ssh -Y USERNAME@login.rc.fas.harvard.edu`). For help with X11 forwarding, start with our [Access and Login page](/resources/access-and-login/#Setup_X11_forwarding_for_lightweight_graphical_applications).

For Windows computers, you will need to download Putty. (SecureCRT or another terminal tool are no longer supported due to recent OpenSSL security updates.)

_See our [Access and Login](/resources/access-and-login) page for more details on ways to connect to Odyssey resources, including [terminal applications](/resources/access-and-login/#Use_any_common_terminal_application_for_command_line_access)._

### <span id="Transfer_any_files_you_may_need">Transfer any files you may need</span>

If you're using a Linux-y terminal like the Mac OSX Terminal tool or a Linux xterm, you'll want to use `scp` for transferring data

<div class="rc-code">scp hg19.chr1.fasta akitzmiller@login:</div>

This will transfer the data into the root of your home directory.

There are also graphical scp tools available. The Filezilla SFTP client is available cross-platform for Mac OSX, Linux, and Windows. See our [SFTP file transfer using Filezilla](/resources/documentation/transferring-data/sftp-file-transfer/) document for more information. Windows users who prefer SCP can download it from [WinSCP.net](http://winscp.net/eng/download.php).

NOTE: If you are off campus or behind a firewall, you should first [connect to the Research Computing VPN](/resources/vpn-setup/).

*   See our [data transfer page using SCP](/resources/documentation/transferring-data/copying-data-to-and-from-odyssey-using-scp/) or our [SFTP file transfer using Filezilla (Mac/Windows/Linux)](/resources/documentation/transferring-data/sftp-file-transfer) pages for more details. *

### <span id="Familiarize_yourself_with_proper_decorum_on_Odyssey">Familiarize yourself with proper decorum on Odyssey</span>

Odyssey is a massive system of shared resources. While much effort is made to ensure that you can do your work in relative isolation, some rules must be followed to avoid interfering with other user's work.

The most important rule on Odyssey is to avoid performing computations on the login nodes. Once you've logged in, you must either submit a batch processing script or start an interactive session (see below). Any significant processing (high memory requirements, long running time, etc.) that is attempted on the login nodes will be killed.

_See the full list of [Odyssey customs and responsibilities](/resources/responsibilities)._

### Determine what software you'd like to load and run **NOTE: We strongly encourage people to use the [new (opt-in) `Lmod` module system](/resources/documentation/software-on-odyssey/), as the legacy module system (centos6/, hpc/, math/ etc) will be phased out.**

A [module](http://modules.sourceforge.net/) system is used on Odyssey to control the run-time environment for individual applications. To find out what modules are available you can either look at the [module list on this website](/module_list/), or use the `module avail` command. By itself, module avail will print out the entire list of packages. To find a specific tool, use the grep command.

<div class="rc-code">module avail 2>&1 | grep -i 'python'</div>

Many of the modules are ports from the older, LSF-based Odyssey cluster. _Only the modules that begin with `centos6` are supported on the current cluster_. If you need a module not found in the list, or need an older module rebuilt for CentOS6, please contact [rchelp](https://portal.rc.fas.harvard.edu/rcrt/submit_ticket) and we will build it for you.

Once you've determined what software you would like to use, load the module:

<div class="rc-code">module load MODULENAME</div>

where MODULENAME is the specific software you want to use. You can use `module unload MODULENAME` to unload a module. To see what modules you have loaded type `module list`. This is very helpful information to provide when you submit help tickets.

Odyssey users by default run in bash shell. If you want modules to load when you log in please add them to your .bashrc file in your home directory.

_For details on running software on the Odyssey cluster, including graphical applications, see [module section of the Running Jobs page](/resources/running-jobs/#A_module_system_is_used_for_enabling_applications)._

### <span id="Determine_where_your_files_will_be_stored">Determine where your files will be stored.</span>

Users of the Odyssey cluster are granted 40Gb of storage in their home directory. This volume has decent performance and is regularly backed up. For many, this is enough to get going. However, there are a number of other storage locations that are important to consider when running software on Odyssey.

1.  **/scratch** When running batch jobs (see below), /scratch is a large, very fast temporary store for files created while a tool is running. It is a good place for temporary files created while a tools is executing because the disks are local to the node that is performing the computation making access is very fast. However, data is only accessible from the node itself so _you cannot directly retrieve it after calculations are finished_.
2.  **/n/regal** Regal is another large temporary store like holyscratch, differing only by the file system technology. We recommend that people use this filesystem as their primary working area, as this area is highly optimized for cluster use and is larger in size that holyscratch. Use this for processing large files, but realize that files will be removed after 90 days and the volume is _not backed up_. Create your own folder inside the folder of your lab group. If that doesn't exist, contact [RCHelp](http://portal.rc.fas.harvard.edu/rcrt/submit_ticket).
3.  **/n/holyscratch** Holyscratch is a large (300 Tb), shared volume that may be used for computations on the cluster. _Holyscratch will be going away soon, so please use Regal._ Performance of this parallel filesystem is very good and can deal with large intermediate files. However, files can not be stored on this volume for more than 90 days and it is _not backed up_. Create your own folder inside the folder of your lab group. If that doesn't exist, contact [RCHelp](http://portal.rc.fas.harvard.edu/rcrt/submit_ticket).
4.  **Lab storage** Each lab that is doing regular work on Odyssey is initially granted 1Tb of group accessible storage. Like home directories, this is a good place for general storage, but it is not high performance and should not be used during I/O intensive processing.

_For details on different types of storage and how obtain more, see the [Odyssey Storage page](/resources/odyssey-storage/)_

### <span id="Run_a_batch_job">Run a batch job...</span>

The Odyssey cluster is managed by a batch job control system called [SLURM](http://slurm.schedmd.com/documentation.html). Tools that you want to run are embedded in a command script and the script is submitted to the job control system using an appropriate SLURM command.

For a simple example that just prints the hostname of a compute host to both standard out and standard err, create a file called `hostname.slurm` with the following content:

<div class="rc-code">#!/bin/bash #SBATCH -n 1 # Number of cores requested #SBATCH -N 1 # Ensure that all cores are on one machine #SBATCH -t 5 # Runtime in minutes #SBATCH -p serial_requeue # Partition to submit to #SBATCH --mem=100 # Memory per cpu in MB (see also --mem-per-cpu) #SBATCH -o hostname.out # Standard out goes to this file #SBATCH -e hostname.err # Standard err goes to this filehostname   hostname 2>&1</div>

Then submit this job script to SLURM

<div class="rc-code">sbatch hostname.slurm</div>

When command scripts are submitted, SLURM looks at the resources you've requested and waits until an acceptable compute node is available on which to run it. Once the resources are available, it runs the script as a background process (i.e. you don't need to keep your terminal open while it is running), returning the output and error streams to the locations designated by the script.

You can monitor the progress of your job using the `squeue -j JOBID` command, where JOBID is the ID returned by SLURM when you submit the script. The output of this command will indicate if your job is PENDING, RUNNING, COMPLETED, FAILED, etc. If the job is completed, you can get the output from the file specified by the `-o` option. If there are errors, the should appear in the file specified by the `-e` option.

[![Example of SLURM batch job submission and monitoring](/wp-content/uploads/2014/03/sbatch-example.png)](/wp-content/uploads/2014/03/sbatch-example.png)

The commands `smap` and `squeue` are also good ways to check the status of your job. See their man pages for usage information.

If you need to terminate a job, the `scancel` command can be used (JOBID is the number returned when the job is submitted).

<div class="rc-code">scancel JOBID</div>

SLURM-managed resources are divided into _partitions_ (known as queues in other batch processing systems). Normally, you will be using the `general` or `serial_requeue` partitions, but there are others for interactive jobs (see below), large memory jobs, etc.

_For more information on the partitions in Odyssey, please see the [SLURM partitions](/resources/running-jobs/#SLURM_partitions) page._

_For more information and running batch jobs in Odyssey, including MPI code, please see the [Running Jobs](/resources/running-jobs/#SLURM_partitions) page._

_For a list of useful SLURM commands, please see the [Convenient SLURM Commands](/resources/documentation/convenient-slurm-commands) page._

### <span id="_or_an_interactive_job">... or an interactive job.</span>

Batch jobs are great for long-lasting computationally intensive data processing. However, many activities like one-off scripts, graphics and visualization, and exploratory analysis do not work well in a batch system, but are too resource intensive to be done on a login node. There is a special partition in Odyssey called "interact" that is designed for responsive, interactive shell and graphical tool usage.

You can start an interactive session using a specific flavor of the `srun` command.

<div class="rc-code">srun -p interact --pty --mem 500 -t 0-6:00 /bin/bash</div>

`srun` is like `sbatch`, but it runs synchronously (i.e. it does not return until the job is finished). The example starts a job on the "interact" partition, with pseudo-terminal mode on (`--pty`), an allocation of 500 MB RAM (`--mem 500`), and for 6 hours (`-t` in `D-HH:MM` format). It also assumes one core on one node. The final argument is the command that you want to run. In this case you'll just get a shell prompt on a compute host. Now you can run any normal Linux commands without taking up resources on a login node. Make sure you choose a reasonable amount of memory (`--mem`) for your session.

You can also launch graphical tools like MATLAB through an `srun` interactive job (as long as you've connected to Odyssey with X11-forwarding enabled: `ssh -X ...`):

<div class="rc-code">srun -p interact --mem 4000 --pty --x11=first -t 0-6:00 /bin/bash module load centos6/matlab-R2013a matlab</div>

Instead of a prompt, you should see the MATLAB graphical environment appear on your desktop.

### <span id="Getting_further_help">Getting further help</span>

If you have any trouble with running jobs on Odyssey, first check the comprehensive [Running Jobs page](/resources/running-jobs) and our [FAQ](/resources/faq). Then, if your questions aren't answered there, feel free to contact us at [RCHelp](https://portal.rc.fas.harvard.edu/rcrt/submit_ticket). Tell us the job ID of the job in question. Also provide us with what script you ran and the error and output files as well. The output of `module list` is helpful, too.

### <span id="A_note_on_requesting_memory_--mem_or_--mem-per-cpu">A note on requesting memory (`--mem` or `--mem-per-cpu`)</span>

In SLURM you must declare how much memory you are using for your job using the `--mem` or `--mem-per-cpu` command switches. By default SLURM assumes you need 100 MB. If you don't request enough the job can be terminated, often times without very useful information (error files can show segfault, file write errors, etc. that are downstream symptoms). If you request too much, it can increase your wait time (it's harder to allocate a lot of memory than a little) and crowd out jobs for other users.

You can view the runtime and memory usage for a past job with

<div class="rc-code">sacct -j JOBID --format=JobID,JobName,ReqMem,MaxRSS,Elapsed</div>

where JOBID is the numeric job ID of a past job:

<div class="rc-code">sacct -j 531306 --format=JobID,JobName,ReqMem,MaxRSS,Elapsed   JobID JobName ReqMeM MaxRSS Elapsed 531306 sbatch 00:02:03 531306.batch batch 750000K 513564K 00:02:03 531306.0 true 916K 00:00:00</div>

The `.batch` portion of the job is usually what you're looking for, but the output may vary. This job had a maximum memory footprint of about 500MB, and took a little over two minutes to run.