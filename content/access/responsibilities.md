Title: Odyssey Customs and Responsibilities
Date: 2015-11-10
Category: Access
Tags: Odyssey, Access
Summary: Rules to follow that make Odyssey a functional, shared system for all users.

The Odyssey cluster is a large, shared resource performing massive computations on terabytes of data. These compute jobs are isolated as much as possible by the SLURM system. However, there are a number of things to keep in mind while using this shared resource so that the system can work as well as possible for everyone.

## Don't run anything on the login nodes, including rcnx01
The Odyssey login nodes (rclogin## and rcnx01) must be kept free of significant computation. Running even modestly memory or CPU intensive programs on the login nodes, if widespread, would eventually lead to users being shut out of the cluster. Jobs run directly on the login nodes will typically be killed if CPU or memory exceeds small amounts.

## Be as accurate as possible when specifying memory for jobs
The specification of memory for job submission (`--mem` or `--mem-per-cpu`) is important to the basic functioning of SLURM. If you specify too little, you job will likely crash. If you specify too much, however, you may 1) end up stuck in the PENDING state while SLURM looks for a node with enough available memory, and 2) you will prevent other users from running their jobs by consuming large portions of a node. Please see our [Note on Requesting Memory](odyssey-quick-start-guide.html#a-note-on-requesting-memory-mem-or-mem-per-cpu) for more info.

## Keep job counts in a reasonable range
The Odyssey system processes more than a million jobs every month and submissions of hundreds to thousands at once are not uncommon. However, job submissions in the 10s of thousands at once can become problematic for the SLURM controller, even when the jobs are requesting modest resources. When the controller is overloaded, all partitions are affected and all researchers using Odyssey will see delays. Try to design your submissions so that you can take advantage of parallel processing, but not overload the system. As a reasonable target, we recommend submitting no more than 1000 jobs.

A common source of excessive jobs is code loops that generate and submit new jobs. Please consider using job arrays or bundling jobs into smaller submissions. Please see our [Submitting Large Numbers of Jobs](/resources/documentation/submitting-large-numbers-of-jobs-to-odyssey/#Varying_parameters_to_batch_jobs) doc for more info on this and job arrays.

## Ensure your jobs run for at least 5 to 10 minutes
Much work is needed by SLURM to schedule, set up, monitor, break down, and archive the logistics of running jobs on our large cluster. A 5 - 10 minute minimum runtime allows SLURM to handle your jobs efficiently while handling those of the 800+ simultaneous users as well.

## Don't bother the scheduler too frequently
If you are using code to submit jobs, please pause at least 0.5 to 1 seconds between `sbatch` commands.

If you are using code to submit and/or monitor job progress (what we call a meta-scheduler), pause at least 5 or 10 minutes between `squeue` or `sacct` queries. Most optimal is one query every unit of time it takes for your job to run. More frequent queries place a larger burden on the scheduler.

## Use the appropriate partition for your work
Nodes in partitions are grouped according to their technical characteristics and likely job profiles. Submitting jobs to a partition for work for which it was not designed can cause slowdowns on your jobs as well as the other jobs running on the same node (e.g. submitting non-GPU work to the GPU partition). On the other hand, using a non-appropriate partition in order to skip ahead of the queue violates our appropriate use policy: jobs may be killed without warning; and repeat offenders may have their priority lowered to zero, effectively suspending your ability to run future jobs.

## Use `serial_requeue` when possible
The `serial_requeue` partition is the most efficient job allocator on the Odyssey cluster. In particular, `serial_requeue` is able to use idle resources in partitions that are owned by individual labs and so it has a much larger pool than the `general` partition. However, because these resources are owned by individual labs, users from those labs have a higher priority and may cause your job to be stopped and restarted elsewhere (hence the "requeue").

Some jobs do not handle requeue very well and should be run on the `general` partition instead. For example, a tool that appends to an existing file (rather than creating it new with each start) might generate incorrect output when requeued. See our [Partitions](running-jobs.html#slurm-partitions) write-up for more information.

Tips for efficient serial_requeue usage
* Zero out your output files at the start of a job if you're appending output
* For longer jobs, try checkpointing your code to let a requeued job pick up where it left off. If your code does not support checkpointing, leave `*.finished` files to mark where you've completed (file breadcrumbs) and use branchpoints to skip over completed parts

## Heavy I/O should be done on `/scratch` or `/n/regal` if possible
Many of the Odyssey file systems are networked storage. This is what allows them to be available to all the nodes in the cluster. However, this also means that tools that read and write files rapidly, especially if they are being run in thousands of parallel jobs, can overload the network hardware and protocols. If possible, these sorts of tasks should utilize `/scratch` located on each node or `/n/regal` our networked scratch storage. The former is locally attached disks that will not interfere with I/O on other nodes and, additionally, have the best performance for intensive reads and writes. The latter is great for large numbers of parallel computations. Please see our [Storage](odyssey-storage.html) doc for more info.

## Poorly behaved jobs will be terminated
Because of the shared nature of the Odyssey system, problem jobs can inhibit access and processing for other users. Therefore, if a job is running improperly (e.g. excessive I/O; unreserved, excessive CPU usage) the job may be terminated. Repeated poor behaviors may result in disabling of the user account.

## Don't mine digital currency using Odyssey resources
or use Odyssey resources for other non-research tasks.
