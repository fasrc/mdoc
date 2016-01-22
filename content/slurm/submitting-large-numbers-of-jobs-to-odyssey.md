Title: Submitting large numbers of jobs to Odyssey
Date: 2014-06-23
Category: slurm
Summary: A number of options for submitting 1000s of jobs to the Odyssey cluster.

### Introduction
Often times one will need to submit a large number of jobs to the cluster for various reasons -- to get high throughput for a big analysis, to vary parameters with one analysis, etc. This document aims to help you become more efficient **and** to help you take advantage of shell and SLURM resources. This will improve your work and help others on the cluster!

**A word of warning**, though. Submitting large numbers of jobs to the cluster can have disastrous consequences if not done correctly, as one can overload the scheduler, bringing the cluster to a grinding halt. Please use these best practices (as outlined in our [Customs and Responsibilities](/resources/responsibilities/) document):
* Please pause 0.5 to 1 seconds between each `sbatch` submit
* Please ensure that each job takes at least 5 to 10 minutes to run, in order to allow the scheduler to process all the work needed to set up, run, and break down scheduled jobs.

We do also recommend that people investigate the use of [gnu_parallel](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&sqi=2&ved=0CB4QFjAAahUKEwjR4N63043HAhWDez4KHWT_AIY&url=http%3A%2F%2Fwww.gnu.org%2Fsoftware%2Fparallel%2F&ei=isG_VdHzLoP3-QHk_oOwCA&usg=AFQjCNEL5474IQ-UZJ6CIQGC3ZR6dkCHIg&bvm=bv.99261572,d.cWw) or [TACC's launcher](https://www.tacc.utexas.edu/research-development/tacc-software/the-launcher), which is installed on Odyssey. We'll include more documentation on these programs in the near future.

We make a few assumptions in this document:

* your filenames do <strong>not</strong> contain spaces. If so, many of these commands may fail.
* you are familiar with [basic UNIX concepts](/training/intro-to-unix/)
* you understand the [partitions](/resources/running-jobs/#SLURM_partitions) and [filesystems](/resources/odyssey-storage/) that are available to the compute nodes.

### Using shell commands
It is relatively easy to use the shell to submit jobs to SLURM:

    :::bash
    # loop over all FASTA files in the directory, print the filename
    # (so we have some visual progress indicator), then submit the
    # gzip jobs to SLURM
    #
    for FILE in `*`.fasta; do
     echo ${FILE}
     sbatch -p serial_requeue -t 10 --mem=200 --wrap="gzip ${FILE}"
     sleep 1 # pause to be kind to the scheduler
    done

These commands do exactly what the comments suggest, sending gzip jobs to compute nodes on Odyssey in a high-throughput manner. A couple of things to note:

* We send jobs to serial_requeue to ensure that the cluster is efficiently used for small (&lt; 24 hr) jobs.
* Often times you'll see shell variables written like `$FILE`. `$FILE` and `${FILE}` are exactly the same, but `${FILE}` is safer to use, especially when embedded in a string of characters. For example `myfile_$DATE_normal.txt` is not the same as `myfile_${DATE}_normal.txt`, as in the former, the shell will look for the variable `$DATE_normal` in the former example and for `$DATE` in the latter one.
* Using the `--wrap=` option for SLURM allows you to avoid writing large numbers of batch files for simple commands. But this is really only useful for one-line commands.

This script is great for a small number of files that you wish to do some trivial operations on (e.g. 3 - 20ish?). Since it is asking SLURM to process each file individually, SLURM will have to track each job/file. OK in small numbers; not so good for large numbers. Also, if you ask SLURM to handle 20 jobs as once, and all those jobs are working on the same directory, you might slow down disk access, esp. if your files are located on a lab disk share. In this case it we advise that you work on one of the scratch filesystems, disks and directories that have been optimized for high-throughput disk access. Please see our guides [Where to Store Your Files](/resources/odyssey-quickstart-guide/#Determine_where_your_files_will_be_stored) and [Odyssey Storage](/resources/odyssey-storage/) for more information. In addition, since it takes SLURM a minimum of several minutes to calculate where and when to run your job, it is best if your jobs/files take at least a minimum of 5 minutes to run.

For more complex jobs, you may need to use a SLURM batch file. For example, to run the bioinformatics program `tophat` with a bunch of FASTQ files, create a SLURM batch file `tophat_manyfiles.sbatch`:

    :::bash
    #!/bin/bash
    #
    # tophat_manyfiles.sbatch
    #
    #SBATCH -p serial_requeue # Partition
    #SBATCH -n 1              # one CPU
    #SBATCH -N 1              # on one node
    #SBATCH -t 0-2:00         # Running time of 2 hours
    #SBATCH --mem 4000        # Memory request

    mkdir ${1}_out
    cd ${1}_out

    tophat /n/informatics/databases/Mus_musculus/UCSC/mm10/Sequence/BowtieIndex \
      ../$1

And you submit your jobs with the command:

    :::bash
    # loop over all FASTQ files in the directory
    # print the filename (so we have some visual progress indicator)
    # then submit the tophat jobs to SLURM
    #
    for FILE in *.fq; do
      echo ${FILE}
      sbatch -o ${FILE}.stdout.txt -e ${FILE}.stderr.txt tophat_manyfiles.sbatch ${FILE}
      sleep 1 # pause to be kind to the scheduler
    done

A few explanations:

* In the bash loop, each FASTQ filename will be substituted for `${FILE}`.
* Inside the SLURM batch file, the passed filename will be substituted for `${1}`. In bash, `${1}` is the 1st parameter passed to the script file.
* Normally, the STDOUT and STDERR options (`-o` and `-e`) are placed in the SLURM batch file. Unfortunately, since the `#SBATCH` lines start with `#` (the hash symbol), bash sees these as comment lines and so it won't do any substitution. To compensate, we put the `-o` and `-e` parameters directly on the `sbatch` call in the shell loop.
* In our SLURM batch file, we create a directory named similarly to the input FASTQ file, move into that directory, then run `tophat`. <em>Nota bene</em>: As we discussed previously, `${1}_out` is not the same as `$1_out`!

### Using job arrays

Although the previous example is an effective method, it is <em>not</em> very efficient for SLURM, since it has to keep track of and schedule each individual job. A better way to do this is to use job arrays. This is documented at [this RC job arrays page](/resources/running-jobs/#Job_arrays) and in more detail at the official [SLURM job arrays page](http://slurm.schedmd.com/job_array.html). This requires that your files be named in sequential order. Briefly, create your SLURM batch file `tophat_arrays.sbatch`:

    :::bash
    #!/bin/bash
    #
    # tophat_arrays.sbatch
    #
    #SBATCH -J tophat         # A single job name for the array
    #SBATCH -p serial_requeue # Partition
    #SBATCH -n 1              # one core
    #SBATCH -N 1              # on one node
    #SBATCH -t 0-2:00         # Running time of 2 hours
    #SBATCH --mem 4000        # Memory request of 4 GB
    #SBATCH -o tophat_%A_%a.out # Standard output
    #SBATCH -e tophat_%A_%a.err # Standard error

    mkdir trans${SLURM_ARRAY_TASK_ID}_out
    cd trans${SLURM_ARRAY_TASK_ID}_out

    tophat /n/informatics/databases/Mus_musculus/UCSC/mm10/Sequence/BowtieIndex \
      ../trans${SLURM_ARRAY_TASK_ID}.fq

And we submit one, grouped set of jobs to SLURM with:

    :::bash
    sbatch --array=1-30 tophat_arrays.sbatch

Much simpler, huh? Explanations:
* `%A` in the `#SBATCH` line becomes the job ID
* `%a` in the `#SBATCH` line becomes the array index
* `${SLURM_ARRAY_TASK_ID}` is a shell variable that is set when the job runs, and it is substituted into the parameter to generate the proper filename which is passed on to `tophat`

### Using job arrays with non-sequentially named files

Well, job arrays are great if your files are named sequentially (e.g. file1.fq, file2.fq, etc). But what if they're not? One can use both shell arrays + SLURM arrays to solve this. A little tricky, but manageable...

You'll read in your list of files into a bash array (e.g. `FILES`), and then work with one item in this list (array) inside your SLURM script. Your script will know which item it is using the shell variable `${SLURM_ARRAY_TASK_ID}` we used last time. Briefly, create your SLURM batch file `tophat_double_array.sbatch`:

    :::bash
    #!/bin/bash
    #
    # tophat_double_array.sbatch
    #
    #SBATCH -J tophat         # A single job name for the array
    #SBATCH -p serial_requeue # best partition for single core small jobs
    #SBATCH -n 1              # one core
    #SBATCH -N 1              # on one node
    #SBATCH -t 0-2:00         # Running time of 2 hours
    #SBATCH --mem 4000        # Memory request of 4 GB
    #SBATCH -o tophat_%A_%a.out # Standard output
    #SBATCH -e tophat_%A_%a.err # Standard error

    # grab out filename from the array exported from our 'parent' shell
    FILENAME=${FILES[$SLURM_ARRAY_TASK_ID]}

    # make &amp; move into new directory, and run!
    mkdir ${FILENAME}_out
    cd ${FILENAME}_out

    tophat /n/informatics/databases/Mus_musculus/UCSC/mm10/Sequence/BowtieIndex \
      ../$FILENAME

Now, we grab all the appropriate files and submit them en-batch with an array:

    :::bash
    # grab the files, and export it so the 'child' sbatch jobs can access it
    export FILES=($(ls -1 *.fq))

    # get size of array
    NUMFASTQ=${#FILES[@]}
    # now subtract 1 as we have to use zero-based indexing (first cell is 0)
    ZBNUMFASTQ=$(($NUMFASTQ - 1))

    # now submit to SLURM
    if [ $ZBNUMFASTQ -ge 0 ]; then
        sbatch --array=0-$ZBNUMFASTQ tophat_double_array.sbatch
    fi

Not so hard, huh? Some explanations:

* Bash arrays are indexed using `[]` characters at the end of the array variable name wrapped with `{}`
* The strange `=($(ls -1 *.fq))` syntax combines executing a command via `$(unix command)` with array assignment `=(array items)`
* One can get the length of a bash array by indexing the array with `[@]` and prefixing the variable name with `#`
* Since bash arrays start with 0 (e.g. `$FILES[0]`), we need to adjust our array to do so as well. So we do bash arithmetic using the `$((math expression))` syntax
* Finally, so that we don't throw bogus jobs at the scheduler, we use a bash conditional `if [ test ]; then ... fi` to ensure that our number of items is greater than (`-gt`) zero.

### Varying parameters to batch jobs

(If you're still with us, great!) So, a routine exercise for R or MATLAB scripts is to run an analysis varying the input parameters. Of course, it'd be great if we can batch these out to Odyssey all at once! Create your SLURM batch file `vary_params.sbatch`:

    :::bash
    #!/bin/bash
    #
    # vary_params.sbatch
    #
    #SBATCH -p serial_requeue # Partition
    #SBATCH -n 1              # one core
    #SBATCH -N 1              # on one machine
    #SBATCH -t 0-0:30         # Running time of 30 minutes
    #SBATCH --mem 1000        # Memory request

    my_analysis_script.sh ${PARAM1} ${SAMPLE_SIZE}

And at the shell,

    :::bash
    for PARAM1 in $(seq 1 5); do
      for SAMPLE_SIZE in 25 50 75 100; do
        #
        echo "${PARAM1}, ${SAMPLE_SIZE}"
        export PARAM1 SAMPLE_SIZE
        #
        sbatch -o out_p${PARAM1}_s${SAMPLE_SIZE}.stdout.txt \
          -e out_p${PARAM1}_s${SAMPLE_SIZE}.stdout.txt \
          --job-name=my_analysis_p${PARAM1} \
          vary_params.sbatch
        #
        sleep 1 # pause to be kind to the scheduler
      done
    done

Explanations:

* The bit of code `$(seq 1 5)` runs the `seq` command in a subprocess that will generate the sequence `1..5`. We could have easily written `1 2 3 4 5`. But now you've learned a new trick.
* We create a nested loop with `SAMPLE_SIZE`.
* The export command is needed to ensure that the shell makes the environment variables `PARAM1` and `SAMPLE_SIZE` available to any sub-shells (your sbatch script).
* In our `sbatch` command, to keep the command easier to read, we terminate each line of the same command with the backslash character `\`. *No other character of any kind can follow the backslash on the line, or else the backslash will be ignored. Bummer!*
* So that we can keep all our output in order and since shell variables are not expanded on the `#SBATCH` line, we specify the STDOUT (`-o`) and STDERR (`-e`) on the sbatch line.
* To track our jobs more easily, we're going to group the job names by `PARAM1`. We can do this by using the `--job-name=` parameter on the sbatch line. Now, all the sample size jobs with the same `PARAM1` value will have the same job name, and we can control them as a group (e.g. in case we need to kill the jobs).

### For further reading

* [RC job array docs](running-jobs.html#Job_arrays)
* [SLURM job arrays](http://slurm.schedmd.com/job_array.html)
* [Learning Bash](http://proquest.safaribooksonline.com.ezp-prod1.hul.harvard.edu/book/operating-systems-and-server-administration/unix/0596009658) at Safari Online (required HUID)
* [Unix Tricks and Text Processing on Odyssey](/training/training-materials/)


