Title: OpenMP Software on Odyssey
Date: 2015-11-30
Category: software
Tags: Fortran,C++,Slurm,Odyssey,OpenMP
Summary: This web-page is intended to help you compile and run OpenMP applications on the Odyssey cluster.

## Introduction

This page will help you compile and run [OpenMP](http://www.openmp.org) applications on Odyssey. Currently we have both the Intel and GNU compiler suites available.  See the [module list](module_list>).

## Example Code

Below are simple OpenMP example codes in both Fortran 90 and C++. 

Fortran:

    :::fortran
    !=====================================================================
    ! Program: omp_test.f90
    !=====================================================================
    program omp_test
      implicit none
      integer(4) :: nthreads
      integer(4) :: tid
      integer(4) :: omp_get_num_threads
      integer(4) :: omp_get_thread_num
    !$omp parallel private( tid )
      tid = omp_get_thread_num()
      write(6,*)"Thread ID:", tid
      if ( tid == 0 ) then
         nthreads = omp_get_num_threads()
         write(6,*)"Number of threads = ", nthreads
      end if
    !$omp end parallel
      stop "End of program."
    end program omp_test

C++:

    //====================================================================
    // Program: omp_test.cpp
    //====================================================================
    #include <iostream>
    #include <string>
    #include <sstream>
    #include <math.h>
    #include <omp.h>
    using namespace std;
    int main()
    {
      int nthreads, tid;
    #pragma omp parallel private( tid)
      {
        tid = omp_get_thread_num();
        nthreads = omp_get_num_threads();
        cout << "Thread ID: " << tid << endl;
        if ( tid == 0 ){
          cout << "Number of threads = " << nthreads << endl;
        }
      }
      return 0;
    }

## Compiling the program

    :::bash
    # Load the module
    [username@rclogin02 ~]$ module load intel/15.0.0-fasrc01
    
    # Intel, Fortran 90:
    [username@rclogin02 ~]$ ifort -o omp_test.x omp_test.f90 -openmp

    # Intel, C++:
    [username@rclogin02 ~]$ icpc -o omp_test.x omp_test.cpp -openmp

    # GNU, Fortran 90:
    [username@rclogin02 ~]$ gfortran -o omp_test.x omp_test.f90 -fopenmp

    # GNU, C++:
    [username@rclogin02 ~]$ g++ -o omp_test.x omp_test.cpp -fopenmp

## Running the program

You could use the following SLURM batch-job submission script to submit the job to the queue:

    :::bash
    #!/bin/bash
    #SBATCH -n 8
    #SBATCH -J omp_test
    #SBATCH -o omp_test.out
    #SBATCH -e omp_test.err
    #SBATCH -N 1
    #SBATCH -p general
    #SBATCH -t 30

    export OMP_NUM_THREADS=8
    ./omp_test.x

The `OMP_NUM_THREADS` environmental variable is used to set the number of threads to the desired number. If you name the above script `omp_test.batch`, for instance, the job is submitted to the queue with

    :::bash
    sbatch omp_test.batch

## References

*   [Official OpenMP website](http://www.openmp.org)
*   [OpenMP tutorial from LLNL](https://computing.llnl.gov/tutorials/openMP)