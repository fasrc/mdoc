Title: TOTALVIEW: Debugging Parallel Applications
Date: 2015-11-30
Category: software
Tags: Fortran,C++,C,Slurm,Odyssey,MPI
Summary: [TotalView](http://www.roguewave.com/products/totalview.aspx) from [Rogue Wave Software](http://www.roguewave.com/) is a debugging tool particularly suitable for debugging of parallel applications.

## Introduction

[TotalView](http://www.roguewave.com/products/totalview.aspx) from [Rogue Wave Software](http://www.roguewave.com/) is a debugging tool particularly suitable for debugging of parallel applications. It provides both X Window-based Graphical User Interface (GUI) and command line interface (CLI) environments for debugging. This page will teach you how to us Totalview on Odyssey.

## Using TotalView on Odyssey

To use Totalview on Odyssey, first you need to load the Totalview module-file to set the correct environment settings. This is done most conveniently by placing the command `module load totalview/8.8.0.1-fasrc01` in your .bashrc startup file. In order to debug MPI parallel applications, you also need to load appropriate Compiler and MPI software modules, for instance:

    :::bash
    module load intel/15.0.0-fasrc01
    module load openmpi/1.8.3-fasrc02

(or place it in your startup file, e.g., .bashrc for the bash shell). In order to use Totalview, your code must be compiled with the -g option. It is also recommended to suppress any level of optimization by compiling your application with the -O0 option.

    :::bash
    # Fortran 77
    [username@rclogin04 ~]$ mpif77 -g -O0 -o tv_test.x tv_test.f

    # Fortran 90
    [username@rclogin04 ~]$ mpif90 -g -O0 -o tv_test.x tv_test.f90

    # C
    [username@rclogin04 ~]$ mpicc -g -O0 -o tv_test.x tv_test.c

    # C++
    [username@rclogin04 ~]$ mpicxx -g -O0 -o tv_test.x tv_test.cpp

**Note:** The instrumented executable should be used for debugging only, not in production runs. After your code is up and running, for actual production runs you need to recompile your application with the desired level of optimization. To use Totalview, you need to log in with an X window forwarding enabled. If you access Odyssey from a Unix-like system, you have to use the -X or -Y option to ssh. The -Y option often works better for Mac OS X. For instructions on how to enable X11 forwarding when accessing Odyssey from Windows click [here](access-and-login.html#setup-x11-forwarding-for-lightweight-graphical-applications).

    :::bash
    ssh -l username login.rc.fas.harvard.edu -X

After loading the Totalview module and compiling with the -g option, request an interactive session:

    :::bash
    [username@rclogin04 ~]$ srun -p interact -n 4 -t 00-01:00 --pty --x11=first --mem-per-cpu=4000 bash
    [username@holy2a18306 ~]$

This will start an interactive (bash) shell and load the module-files included in your startup .bashrc file. Then launch the debugger with one of the following commands:

    :::bash
    totalview mpirun -a -np 4 ./tv_test.x

or

    :::bash
    mpirun -np 4 -tv ./tv_test.x

or

    :::bash
    mpirun -np 4 -debug ./tv_test.x

The Totalview startup GUI will pop up and display debugging startup parameters, as illustrated below. After reviewing them, click OK. 

<figure>
	<a class="img" href="/docs/images/tv_startup.jpg">
    		<img class="img-responsive" src="/docs/images/tv_startup.jpg"></img>
	</a>
    <figcaption></figcaption>
</figure>


Go to the process window, and click the "Go" button. 

<figure>
	<a class="img" href="/docs/images/tv_process.jpg">
    		<img class="img-responsive" src="/docs/images/tv_process.jpg"></img>
	</a>
    <figcaption></figcaption>
</figure>


**Note:** At this stage Totalview displays the source code of the mpirun function, NOT the source code of your application. After you click "GO" in the process window, a small window will pop up, asking whether the mpirun process should be stopped. Click "Yes". 

<figure>
	<a class="img" href="/docs/images/tv_stop.jpg">
    		<img class="img-responsive" src="/docs/images/tv_stop.jpg"></img>
	</a>
    <figcaption></figcaption>
</figure>


Then, in the "Stack Trace" section of the process window you should see the name of the main program of your application. You can now display the source code by clicking on it. To start debugging, create a break point by clicking on a line number in the source pane, and click "Go". After that, you can use other buttons ("Next", "Step", "Out", etc). 

<figure>
	<a class="img" href="/docs/images/tv_source.jpg">
    		<img class="img-responsive" src="/docs/images/tv_source.jpg"></img>
	</a>
    <figcaption></figcaption>
</figure>

## References

* [Official Totalview Documentation](http://www.roguewave.com/support/product-documentation/totalview-family.aspx#totalview) 

* [Totalview tutorial, Lawrence Livermore National Laboratory](https://computing.llnl.gov/tutorials/totalview/)