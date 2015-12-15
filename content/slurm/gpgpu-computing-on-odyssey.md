Title: GPGPU Computing on Odyssey
Date: 2015-11-10
Category: slurm
Tags: Odyssey, Slurm, GPU
Summary: Using the GPGPU resources on Odyssey.

Odyssey has a number of nodes that have NVIDIA Tesla general purpose graphics processing units (GPGPU) attached to them. It is possible to use CUDA tools to run computational work on them and in some use cases see very significant speed ups.

One node with 8 Tesla K20Xm is available for general use from the `gpu` partition; the remaining are nodes are owned by various research groups available in their private partitions (and may be available when idle through serial_requeue and the options shown below.) Direct access to these nodes by members of other groups is by special request. Please visit the [RC Portal](rchelp>) and submit a help request for more information.

###GPGPU's on SLURM
To request a GPU on slurm just add `#SBATCH --gres=gpu` to your submission script and it will give you access to a GPGPU.  You can use this method to request both CPUs and GPGPUs independently.  So if you want 1 CPU and 2 GPGPUs from our general use node, you would specify:

    :::bash
    #SBATCH -p gpu
    #SBATCH -n 1
    #SBATCH --gres=gpu:2
