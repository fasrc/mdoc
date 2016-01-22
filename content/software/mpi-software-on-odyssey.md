Title: MPI Software on Odyssey
Date: 2015-11-30
Category: software
Tags: Fortran,C,C++,Slurm,Odyssey,MPI
Summary: This web-page is intended to help you compile and run MPI applications on the Odyssey cluster.

## Introduction

This web-page is intended to help you compile and run MPI applications on the Odyssey cluster. (NOTE: Instructions are based on our [Helmod module system](software-on-odyssey.html).

The Message Passing Interface (MPI) library allows processes in your parallel application to communicate with one another by sending and receiving messages. There is no default MPI library in your environment when you log in to Odyssey. You need to choose the desired MPI implementation for your applications. This is done by loading an appropriate MPI module. Currently the available MPI implementations on our cluster are [OpenMPI](http://www.open-mpi.org) and [Mvapich2](http://mvapich.cse.ohio-state.edu). For both implementations the MPI libraries are compiled and built with either the [Intel compiler suite](http://software.intel.com/en-us/intel-compilers) or the [GNU compiler suite<](http://www.gnu.org/software/gcc). These are organized in [software modules](software-on-odyssey.html). For instance, if you want to use OpenMPI compiled with the GNU compiler you need to load appropriate compiler and MPI modules:

    :::bash
    [username@rclogin08 ~]$ module load gcc/4.8.2-fasrc01 
    [username@rclogin08 ~]$ module load openmpi/1.10.1-fasrc01

For reproducibility and consistency it is recommended to use the complete module name with the module load command, as illustrated above. Modules on Odyssey get updated often so check if there are more recent ones. The modules are set up so that you can only have one MPI module loaded at a time. If you try loading a second one it will automatically unload the first. This is done to avoid dependencies collisions. There are four ways you can set up your MPI on Odyssey:

*   Put the module load command in your startup files  
    Most users will find this option most convenient. You will likely only want to use a single version of MPI for all your work. This method also works with all MPI modules currently available on Odyssey.
*   Load the module in your current shell  
    For the current MPI versions you do not need to have the module load command in your startup files. If you submit a job the remote processes will inherit the submission shell environment and use the proper MPI library. Note this method does **not** work with older versions of MPI.
*   Load the module in your job script  
    If you will be using different versions of MPI for different jobs, then you can put the module load command in your script. You need to ensure your script can execute the module load command properly.
*   Do not use modules and set environment variables yourself  
    You obviously do not need to use modules but can hard code paths. However, these locations may change without warning so you should set them in one location only and not scatter them throughout your scripts. This option could be useful if you have a customized local build of MPI you would like to use with your applications.


## Your First MPI Program

When you successfully log in you will land in your `$HOME` directory. Open a new file mpitest.<language_extension> ( language_extension: f, f90, c, or cpp ) with a text editor such as emacs or vi. Paste the contents of the below code into the file.

Fortran 77:

    c=====================================================
    c Fortran 77 MPI example: mpitest.f
    c=====================================================
          program mpitest
          implicit none
          include 'mpif.h'
          integer(4) :: ierr
          integer(4) :: iproc
          integer(4) :: nproc
          integer(4) :: i
          call MPI_INIT(ierr)
          call MPI_COMM_SIZE(MPI_COMM_WORLD,nproc,ierr)
          call MPI_COMM_RANK(MPI_COMM_WORLD,iproc,ierr)
          do i = 0, nproc-1
            call MPI_BARRIER(MPI_COMM_WORLD,ierr)
            if ( iproc == i ) then
              write (6,*) 'Rank',iproc,'out of',nproc
            end if
          end do
          call MPI_FINALIZE(ierr)
          if ( iproc == 0 ) write(6,*)'End of program.'
          stop
          end


Fortran 90:

    !=====================================================
    ! Fortran 90 MPI example: mpitest.f90
    !=====================================================
    program mpitest
      implicit none
      include 'mpif.h'
      integer(4) :: ierr
      integer(4) :: iproc
      integer(4) :: nproc
      integer(4) :: i
      call MPI_INIT(ierr)
      call MPI_COMM_SIZE(MPI_COMM_WORLD,nproc,ierr)
      call MPI_COMM_RANK(MPI_COMM_WORLD,iproc,ierr)
      do i = 0, nproc-1
         call MPI_BARRIER(MPI_COMM_WORLD,ierr)
         if ( iproc == i ) then
            write (6,*) 'Rank',iproc,'out of',nproc
         end if
      end do
      call MPI_FINALIZE(ierr)
      if ( iproc == 0 ) write(6,*)'End of program.'
      stop
    end program mpitest

C:

    //==============================================================
    // C MPI example: mpitest.c
    //==============================================================
    #include <stdio.h>
    #include <mpi.h>
    int main(int argc, char** argv){
      int iproc;
      int nproc;
      int i;
      MPI_Init(&argc,&argv);
      MPI_Comm_rank(MPI_COMM_WORLD,&iproc);
      MPI_Comm_size(MPI_COMM_WORLD,&nproc);
      for ( i = 0; i <= nproc - 1; i++ ){
        MPI_Barrier(MPI_COMM_WORLD);
        if ( i == iproc ){
          printf("%s %d %s %d \n","Rank",iproc,"out of",nproc);
        }
      }
      MPI_Finalize();
      return 0;
    }

C++:

    //==============================================================
    // C++ MPI example: mpitest.cpp
    //==============================================================
    #include <iostream>
    #include <mpi.h>
    using namespace std;
    int main(int argc, char** argv){
      int iproc;
      int nproc;
      int i;
      MPI_Init(&argc,&argv);
      MPI_Comm_rank(MPI_COMM_WORLD,&iproc);
      MPI_Comm_size(MPI_COMM_WORLD,&nproc);
      for ( i = 0; i <= nproc - 1; i++ ){
        MPI_Barrier(MPI_COMM_WORLD);
        if ( i == iproc ){
          cout << "Rank " << iproc << " out of " << nproc << endl;
        }
      }
      MPI_Finalize();
      return 0;
    }

### Compile the program

    :::bash
    # Load the compiler and MPI libraries
    [username@rclogin08 ~]$ module load gcc/4.8.2-fasrc01 openmpi/1.10.1-fasrc01
    
    # Fortran 77
    [username@rclogin08 ~]$ mpif77 -o mpitest.x mpitest.f

    # Fortran 90
    [username@rclogin08 ~]$ mpif90 -o mpitest.x mpitest.f90

    # C
    [username@rclogin08 ~]$ mpicc -o mpitest.x mpitest.c

    # C++
    [username@rclogin08 ~]$ mpicxx -o mpitest.x mpitest.cpp


### Create a batch script

With a text editor like emacs or vi open a new file named `mpitest.batch` and paste in the contents below:

    :::bash
    #!/bin/bash
    #SBATCH -J mpitest
    #SBATCH -o mpitest.out
    #SBATCH -e mpitest.err
    #SBATCH -p general
    #SBATCH -n 8
    #SBATCH -t 30
    #SBATCH --mem-per-cpu=40000

    mpirun -np 8 ./mpitest.x

The batch script is used to instruct Odyssey to reserve computational resources for your job and how your application should be launched on the compute nodes reserved for the job.

### Submit your job to the queue

The `sbatch` command followed the `batch script name` is used to submit your batch script to the Odyssey compute nodes. Upon submission a job ID is returned, such as

    :::bash
    [username@rclogin08 ~]$ sbatch mpitest.batch
    Submitted batch job 48859581
    [username@rclogin08 ~]$

### Monitor your job

After you submit your job, the system scheduler will check to see if there are compute nodes available to run the job. If there are compute nodes available, your job will start running. If there are not, your job will wait in the queue until there are enough resources to run your application. You can monitor your position in the queue with the `sacct` command.

    :::bash
    [username@rclogin08 ~]$ sacct
           JobID    JobName  Partition    Account  AllocCPUS      State ExitCode
    ------------ ---------- ---------- ---------- ---------- ---------- --------
    48859581        mpitest    general   rc_admin          8  COMPLETED      0:0
    48859581.ba+      batch              rc_admin          8  COMPLETED      0:0
    48859581.0        orted              rc_admin          1  COMPLETED      0:0</div>

### Examine your job's output

When your job has completed you should see a file called `mpitest.out`

     Rank           0 out of           8
     Rank           1 out of           8
     Rank           2 out of           8
     Rank           3 out of           8
     Rank           4 out of           8
     Rank           5 out of           8
     Rank           6 out of           8
     Rank           7 out of           8
     End of program.

## MPI References

*   [Good Parallel Computing/MPI tutorials](https://computing.llnl.gov/?set=training&page=index)
*   [RS/6000 SP: Practical MPI Programming](http://www.redbooks.ibm.com/redbooks/pdfs/sg245380.pdf)
*   [Open MPI: Open Source High Performance Computing](http://www.open-mpi.org/)
*   [MVAPICH implementation of MPI](http://mvapich.cse.ohio-state.edu/)
*   [MPICH implementation of MPI](http://www.mcs.anl.gov/research/projects/mpich2/)