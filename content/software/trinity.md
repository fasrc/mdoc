Title: Trinity
Date: 2015-11-10
Category: Software
Tags: Odyssey
Summary: Using Trinity software on Odyssey

The [Trinity software](http://trinityrnaseq.github.io/) is used to build transcripts by de novo assembly of RNA-Seq reads from NextGen sequence data. The package is a complex integration of three stages: inchworm, chrysalis, and butterfly. To run this efficiently on Odyssey, these three stages should be broken in to three parts:

*inchworm + chrysalis*, which are RAM bound
*butterfly*, which is processor bound

Using a SLURM job dependency and the `--gridconf` option in Trinity, you can submit your assembly to Odyssey to run these two parts sequentially, using the Odyssey resources most efficiently. Please see pages 41 & 42 of our Informatics tutorial on [Genome/Transcript Assembly](http://informatics.fas.harvard.edu/wp-content/uploads/2014/10/Oct2014Workshop_GenomeAssembly.pdf#page=41).

NOTE: only use the `bigmem` partition if you require more than 250 GB of RAM for the first two stages. Trinity RAM requirements are discussed [here](http://trinityrnaseq.github.io/#typical_usage). If you require less than this, please submit to `general` or `unrestricted`.

NOTE: you can also sidestep the large RAM rquirements by performing *in silico digital normalization* of your input FASTQ files, as documented [on the Trinity site](http://trinityrnaseq.github.io/#insilinorm) and in our [Informatics recipe](http://informatics.fas.harvard.edu/wp-content/uploads/2014/10/Oct2014Workshop_GenomeAssembly.pdf#page=39).

