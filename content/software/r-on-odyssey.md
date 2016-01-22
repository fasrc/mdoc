Title: R on Odyssey
Date: 2015-11-30
Category: software
Tags: R,Odyssey
Summary: Using R on the Odyssey cluster.

##Basics

To use R on the Odyssey cluster, load the appropriate version available via our [modules](module_list>).

###Installing local R packages

You may need to load packages or libraries to complete your work.

**If you expect these libraries to be useful to others in the community, please [send us a request](rchelp>) to install them globally.**

If you'd like to test, you can can install local copies in your home directory like so:

* ensure the `~/.bashrc` file has the following contents:<br> `export R_LIBS_USER=~/apps/R:$R_LIBS_USER`
* enter the command `export R_LIBS_USER=~/apps/R:$R_LIBS_USER`.
* create these directories to hold your local packages: `mkdir -pv ~/apps/R`
* for new modules, enter `source new-modules.sh; module load R_packages`. (for old, legacy modules, load R via: <code>module load centos6/R-3.0.2</code>)
* at the R prompt, you should be able to install packages now: `install.packages("name of package here")`
* you'll be prompted to select a nearby [CRAN mirror](http://cran.r-project.org)
* R should then install the package

Once you've done all that, you can verify if your library is installed and should be able to work with it.

###Running R Batch Jobs on Odyssey
To submit R jobs to Odyssey via SLURM, the R command in your SLURM batch file should be in the format:

    :::bash
    R CMD BATCH --quiet --no-restore --no-save scriptfile outputfile
    
where 
<ul>
   <code> --quiet</code> silences the startup messages so that they won't appear in your output
    <code>--no-restore</code> does not restore the R workspace at startup
    <code>--no-save</code> does not save your R batch environment at exit
    <code>scriptfile</code> is your R script
    <code>outputfile</code> is where all output will be sent</ul>
If you wish to pass along command line arguments in your SLURM batch script, you need to use the format:
<div class="rc-code">R CMD BATCH --no-save --no-restore '--args a=1 b=c(2,5,6)' test.R test.out </div>
and include the following lines in your R script:

    :::r
     # First read in the arguments listed at the command line
    args=(commandArgs(TRUE))
     
    # args is now a list of character vectors
    # First check to see if arguments are passed.
    # Then cycle through each element of the list and evaluate the expressions.
    if (length (args) == 0) {
      print("No arguments supplied.")
      ## supply default values
      a = 1
      b = c(1,1,1)
    } else {
      for (i in 1:length(args)) {
        eval (parse (text = args[[i]] ))
      }
    }
 
    print (a)
    print (b)

Your output file <code>test.out</code> should have the following lines in it:

    :::r
    > print (a)
    [1] 1
    > print (b)
    [1]  2 5 6</div>

More examples and detail can be found at [this helpful Stack Overflow webpage] (http://stackoverflow.com/questions/14167178/passing-command-line-arguments-to-r-cmd-batch) and the [R doc pages](http://www.r-project.org/other-docs.html).

You can also use the Rscript command. Please consult the the O'Reilly book <em>R Cookbook</em> for the difference between <code>R CMD BATCH</code> and <code>RScript</code> at [O'Reilly Books Online for Harvard](http://proquest.safaribooksonline.com.ezp-prod1.hul.harvard.edu/book/programming/r/9780596809287/3dot-navigating-the-software/id3372214?uicode=harvard) (valid Harvard ID required).

###Running Large #s of R Batch Jobs
If you need to submit a large number of files (<em>e.g.</em> varying the parameters for jobs submitted), please see our documentation on <[Submitting Large Numbers of Files to Odyssey](/submitting-large-numbers-of-jobs-to-odyssey.html).


