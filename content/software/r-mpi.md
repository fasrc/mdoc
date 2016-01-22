Title: R MPI
Date: 2015-11-30
Category: software
Tags: R,Odyssey,MPI
Summary: Using R on the Odyssey cluster with MPI support.

## Introduction

This page is intended to help you with writing and running parallel R codes using the [Rmpi](http://cran.r-project.org/web/packages/Rmpi/index.html) package, the MPI interface for R, on the Odyssey cluster. Currently, `Rmpi` is available with the software module `R/3.2.2-fasrc02` with both OpenMPI version 1.10.1 and Mvapich2 version 2.0 MPI libraries, compiled with both Intel version 15 and GNU version 4.8.2 compilers. In order to use the `Rmpi` package, first you need to load an appropriate set of software modules in your user environment, e.g.,

    :::bash
    module load intel/15.0.0-fasrc01
    module load mvapich2/2.0-fasrc03
    module load R/3.2.2-fasrc02


It is recommended to place these commands in your `.bashrc` file in your home directory.

## Example Rmpi code

Below is an example R code using Rmpi:

    :::r
    # Load the R MPI package if it is not already loaded.
    if (!is.loaded("mpi_initialize")) {
        library("Rmpi")
    }
    
    # In case R exits unexpectedly, have it automatically clean up
    # resources taken up by Rmpi (slaves, memory, etc...)
    .Last <- function(){
        if (is.loaded("mpi_initialize")){
            if (mpi.comm.size(1) > 0){
                print("Please use mpi.close.Rslaves() to close slaves.")
                mpi.close.Rslaves()
            }
            print("Please use mpi.quit() to quit R")
            .Call("mpi_finalize")
        }
    }

    # Tell all slaves to return a message identifying themselves
    mpi.remote.exec(paste("I am",mpi.comm.rank(),"of",mpi.comm.size(),system("hostname",intern=T)))

    # Tell all slaves to close down, and exit the program
    mpi.close.Rslaves()


If you name this code `mpi_tes.R`, for instance, it is submitted to the queue with the following batch-job submission script:

    :::bash
    #!/bin/bash
    #SBATCH -J mpi_test
    #SBATCH -o mpi_test.out
    #SBATCH -e mpi_test.err
    #SBATCH -p general
    #SBATCH -n 8
    #SBATCH -t 30
    #SBATCH --mem-per-cpu=4000
    mpirun -np 8 R CMD BATCH --no-save --no-restore mpi_test.R


*NOTE:* When using OpenMPI, please replace the `mpirun` command line in the above script with

    :::bash
    mpirun -np 8 --mca mpi_warn_on_fork 0 R CMD BATCH --no-save --no-restore mpi_test.R


Assuming the batch-job submission script is named `mpi_test.run`, the job is submitted to the queue by typing in

    :::bash
    sbatch mpi_test.run


Upon completion the job output is in the file <code>mpi_test.Rout</code> which has the below contents

    :::r
    R version 3.2.2 (2015-08-14) -- "Fire Safety"
    Copyright (C) 2015 The R Foundation for Statistical Computing
    Platform: x86_64-pc-linux-gnu (64-bit)

    R is free software and comes with ABSOLUTELY NO WARRANTY.
    You are welcome to redistribute it under certain conditions.
    Type 'license()' or 'licence()' for distribution details.

      Natural language support but running in an English locale

    R is a collaborative project with many contributors.
    Type 'contributors()' for more information and
    'citation()' on how to cite R or R packages in publications.

    Type 'demo()' for some demos, 'help()' for on-line help, or
    'help.start()' for an HTML browser interface to help.
    Type 'q()' to quit R.

    master (rank 0, comm 1) of size 8 is running on: holy2a13205
    slave1 (rank 1, comm 1) of size 8 is running on: holy2a13306
    slave2 (rank 2, comm 1) of size 8 is running on: holy2a13306
    slave3 (rank 3, comm 1) of size 8 is running on: holy2a13306
    slave4 (rank 4, comm 1) of size 8 is running on: holy2a13306
    slave5 (rank 5, comm 1) of size 8 is running on: holy2a13306
    slave6 (rank 6, comm 1) of size 8 is running on: holy2a13306
    slave7 (rank 7, comm 1) of size 8 is running on: holy2a13306
    > # Load the R MPI package if it is not already loaded.
    > if (!is.loaded("mpi_initialize")) {
    +     library("Rmpi")
    +     }
    >
    > # In case R exits unexpectedly, have it automatically clean up
    > # resources taken up by Rmpi (slaves, memory, etc...)
    > .Last <- function(){
    +     if (is.loaded("mpi_initialize")){
    +         if (mpi.comm.size(1) > 0){
    +             print("Please use mpi.close.Rslaves() to close slaves.")
    +             mpi.close.Rslaves()
    +         }
    +         print("Please use mpi.quit() to quit R")
    +         .Call("mpi_finalize")
    +     }
    + }
    >
    > # Tell all slaves to return a message identifying themselves
    > mpi.remote.exec(paste("I am",mpi.comm.rank(),"of",mpi.comm.size(),system("hostname",intern=T)))
    $slave1
    [1] "I am 1 of 8 holy2a13306.rc.fas.harvard.edu"

    $slave2
    [1] "I am 2 of 8 holy2a13306.rc.fas.harvard.edu"

    $slave3
    [1] "I am 3 of 8 holy2a13306.rc.fas.harvard.edu"

    $slave4
    [1] "I am 4 of 8 holy2a13306.rc.fas.harvard.edu"

    $slave5
    [1] "I am 5 of 8 holy2a13306.rc.fas.harvard.edu"

    $slave6
    [1] "I am 6 of 8 holy2a13306.rc.fas.harvard.edu"

    $slave7
    [1] "I am 7 of 8 holy2a13306.rc.fas.harvard.edu"

    >
    > # Tell all slaves to close down, and exit the program
    > mpi.close.Rslaves()
    [1] 1
    >
    >
    [1] "Please use mpi.quit() to quit R"
    > proc.time()
       user  system elapsed
      2.803   0.210   7.239

## Resources

* [CRAN - Package Rmpi](http://cran.r-project.org/web/packages/Rmpi/index.html)
* [Rmpi manual](https://cran.r-project.org/web/packages/Rmpi/Rmpi.pdf)
