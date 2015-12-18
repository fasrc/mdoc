Title: Slurm Memory Limits
Date: 2015-11-10
Category: guides
Tags: Odyssey, Slurm
Summary: A brief discussion of memory handling in Slurm

SLURM imposes a memory limit on each job. By default, it is deliberately relatively small — 100 MB per node. If your job uses more than that, you’ll get an error that your job *Exceeded job memory limit*. To set a larger limit, add to your job submission:

    :::bash
    #SBATCH --mem X

where X is the maximum amount of memory your job will use per node, in MB. The larger your working data set, the larger this needs to be, but the smaller the number the easier it is for the scheduler to find a place to run your job. To determine an appropriate value, start relatively large (job slots on average have about 4000 MB per core, but that’s much larger than needed for most jobs) and then use `sacct` to look at how much your job is actually using or used:

    :::bash
    sacct -o MaxRSS -j JOBID

where JOBID is the one you’re interested in. The number is in KB, so divide by 1024 to get a rough idea of what to use with `–-mem` (set it to something a little larger than that, since you’re defining a hard upper limit). If your job completed long in the past you may have to tell sacct to look further back in time by adding a start time with `-S YYYY-MM-DD`. Note that for parallel jobs spanning multiple nodes, this is the maximum memory used on any one node; if you’re not setting an even distribution of tasks per node (e.g. with `–-ntasks-per-node`), the same job could have very different values when run at different times.
