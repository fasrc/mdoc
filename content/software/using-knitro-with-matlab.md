Title: Using KNITRO with MATLAB
Date: 2015-11-30
Category: software
Tags: Matlab,Odyssey
Summary: Using KNITRO with MATLAB

## Introduction

[KNITRO](http://www.ziena.com/knitro.htm) is a solver for non-liner optimization developed by [ZIENA](http://www.ziena.com/). This page provides information on how use the KNITRO solver with MATLAB on Odyssey.

## Using KNITRO

Currently, we have an active license for KNITRO version 9.1.0. The software is available with the `knitro/9.1.0-fasrc01` module under Helmod and works with MATLAB version R2015a available with software module `matlab/R2015a-fasrc01`. Below is a quick illustration on how to use the solver interactively:

(1) Start an interactive `bash` shell:

    :::bash
    [pkrastev@sa01 ~]$ srun -p interact -n 1 -t 30 --pty --x11=first --mem=4000 bash
    [pkrastev@holy2a18308 ~]$

(2) Load appropriate software modules:

    :::bash
    [pkrastev@holy2a18308 ~]$ module load matlab/R2015a-fasrc01
    [pkrastev@holy2a18308 ~]$ module load knitro/9.1.0-fasrc01

(3) Start Matlab interactively and run a KNITRO test:

    :::bash
    [pkrastev@holy2a18308 ~]$ matlab -nosplash -nojvm -nodesktop -nodisplay

&nbsp;
    
    :::matlab
    
                                 < M A T L A B (R) >
                         Copyright 1984-2015 The MathWorks, Inc.
                          R2015a (8.5.0.197613) 64-bit (glnxa64)
                                  February 12, 2015

     
    For online documentation, see http://www.mathworks.com/support
    For product information, visit www.mathworks.com.
     

    	Academic License

    >> [x fval] = knitromatlab(@(x)cos(x),1)

    ======================================
      Academic Ziena License (NOT FOR COMMERCIAL USE)
                 KNITRO 9.1.0
              Ziena Optimization
    ======================================

    KNITRO presolve eliminated 0 variables and 0 constraints.

    algorithm:            1
    gradopt:              4
    hessopt:              2
    honorbnds:            1
    maxit:                10000
    outlev:               1
    par_concurrent_evals: 0
    The problem is identified as unconstrained.
    KNITRO changing bar_switchrule from AUTO to 1.
    KNITRO changing bar_murule from AUTO to 4.
    KNITRO changing bar_initpt from AUTO to 3.
    KNITRO changing bar_penaltyrule from AUTO to 2.
    KNITRO changing bar_penaltycons from AUTO to 1.
    KNITRO changing bar_switchrule from AUTO to 1.
    KNITRO changing linsolver from AUTO to 2.

    Problem Characteristics
    -----------------------
    Objective goal:  Minimize
    Number of variables:                     1
        bounded below:                       0
        bounded above:                       0
        bounded below and above:             0
        fixed:                               0
        free:                                1
    Number of constraints:                   0
        linear equalities:                   0
        nonlinear equalities:                0
        linear inequalities:                 0
        nonlinear inequalities:              0
        range:                               0
    Number of nonzeros in Jacobian:          0
    Number of nonzeros in Hessian:           1

    EXIT: Locally optimal solution found.

    Final Statistics
    ----------------
    Final objective value               =  -1.00000000000000e+00
    Final feasibility error (abs / rel) =   0.00e+00 / 0.00e+00
    Final optimality error  (abs / rel) =   2.37e-09 / 2.37e-09
    # of iterations                     =          7 
    # of CG iterations                  =          0 
    # of function evaluations           =         20
    # of gradient evaluations           =          0
    Total program time (secs)           =       0.44920 (     0.251 CPU time)
    Time spent in evaluations (secs)    =       0.41352

    ===============================================================================


    x =

        3.1416


    fval =

       -1.0000

    >>