Title: Fortran and Mixed Language Codes on Odyssey
Date: 2015-11-30
Category: software
Tags: Fortran,C,Make,Odyssey
Summary: Fortran and Mixed Language Codes on Odyssey

In order to cross-compiled mixed Fortran and C code on Odyssey using GNU compilers, let us look at the following simple codes:


    :::fortran
    [hptc@iliadaccess02 cfortran]$ cat cfortran.f
    C     Check for NAN
    C
          PROGRAM checknum
          IMPLICIT NONE
          REAL fnum
          INTEGER isnan
          INTEGER isinf
          INTEGER isit
          fnum=log(0.)
          isit=isinf(fnum)
          WRITE (*,*) isit
          STOP
          END
&nbsp;
          
          :::c
          [hptc@iliadaccess02 cfortran]$ cat checknan.c
          #include <stdio.h>
          #include <math.h>
          int isnan_(float *fnum)
          {
            if (isnan( *fnum) != 0)
              {
                return 1;
              }
            return 0;
          }
          int isinf_(float \*fnum)
          {
            if (isinf(\*fnum) != 0)
              {
                return 1;
              }
            return 0;
          }

**Note:** The underscores in the C function names are necessary.

Use the following Makefile:

     :::makefile
     [hptc@iliadaccess02 cfortran]$ cat Makefile 
     CC=gcc
     F77=g77
     CFLAGS=-g
     FFLAGS=-g
     LIB=-lm
     RM=/bin/rm -f

     EXE = cfortran
     OBJ = cfortran.o checknan.o

     $(EXE): $(OBJ) Makefile
             $(F77) $(FFLAGS) -o $(EXE) $(OBJ) $(LIB)
     .f.o:
             $(F77) $(FFLAGS) -o $*.o -c $*.f
     .c.o:
             $(CC) $(CFLAGS) -o $*.o -c $*.c
     clean:
             $(RM) $(EXE) $(OBJ) *~

This gives:

    :::bash
    [hptc@iliadaccess02 cfortran]$ make
    g77 -g -o cfortran.o -c cfortran.f
    gcc -g -o checknan.o -c checknan.c
    g77 -g -o cfortran cfortran.o checknan.o -lm
    [hptc@iliadaccess02 cfortran]$ ./cfortran 
     1


As `log(0)` is infinite, the program answers 1.