Title: Matlab figures in a batch mode
Date: 2016-01-08
Category: software
Tags: Odyssey, Matlab, Slurm
Summary: Generating figures in Matlab when running under Slurm batch mode

This web-page illustrates how to create MATLAB figures in a batch-mode (without a GUI) on the Odyssey cluster. This is especially useful if you would like to do your computations and post-processing all together in a consistent computing environment. Below is an example function which generates data, creates a figure, and saves it as a file on the cluster:

    :::matlab
    %========================================================================================= 
    % Program: print_figure.m 
    % 
    % Usage: 
    % matlab -nodesktop -nodisplay -nosplash -r "print_figure('file_name','file_format');exit"
    %========================================================================================= 
    function [] = print_figure( outfile, file_format ) 
        disp('A simple test to illustrate generating figures in a batch mode.'); 
        x = 0:.1:1; 
        A = exp(x); 
        plot(x,A); 
        print(outfile,file_format); 
    end

The specific example saves the figure as a PNG (24-bit) image. For complete list of available image formats, please refer to the [official MATLAB documentation](http://www.mathworks.com/help/matlab/ref/print.html#input_argument_formattype). 

Here is an example Slurm batch-job submission script for sending the job to the queue:

    :::bash
    #!/bin/bash 
    #SBATCH -J print_figure 
    #SBATCH -o print_figure.out 
    #SBATCH -e print_figure.err 
    #SBATCH -p serial_requeue 
    #SBATCH -n 1 
    #SBATCH -t 30 
    #SBATCH --mem=2000 
    matlab -nodesktop -nodisplay -nosplash -r "print_figure('out','-dpng'); exit"

Please, notice the options `-nodesktop -nodisplay -nosplash` on the MATLAB command line. These reassure the figure is generated properly without the GUI. If you name this script, e.g., `print_figure.run`, it is submitted to the queue with

    :::bash
    sbatch print_figure.run

Upon job completion the file "out.png" is generated in the work directory.
