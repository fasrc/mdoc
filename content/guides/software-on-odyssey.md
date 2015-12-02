Title: Software on Odyssey
Date: 2015-11-30
Category: guides
Tags: Odyssey, Slurm, Helmod, Python, GPU, CUDA, Anaconda
Summary: This guide provides an overview of how software is accessed and used on the Odyssey cluster.

## Odyssey software runs on a CentOS 6.5 Linux distribution
Nearly all of the nodes in the Odyssey cluster run the CentOS 6.5 Linux operating system.  As you can see if you run the `yum list installed` command, this implies glibc 2.12, a 2.6 Linux kernel, and a default gcc 4.4.7 compiler.

Software packages are installed from a locked, local version of the CentOS and epel rpms.  

The default, preferred shell is bash.  Many parts of our software infrastructure will not work under csh or tcsh.

## An enhanced module system called Helmod is used to enable applications
In academic environments, software management is more complex than for individual, stand alone computers.  Users need multiple versions of the same package; many applications cannot be installed with the system package manager; software needed by different users may conflict.  As a result many shared compute resources use [Linux environment modules](http://modules.sourceforge.net/) to manage access to software.  Linux modules alter your environment (e.g. PATH, LD_LIBRARY_PATH, PYTHONPATH) to enable a subset of the applications deployed to the cluster.  For many years, Odyssey has used modules to enable applications.

[Lmod](https://www.tacc.utexas.edu/research-development/tacc-projects/lmod), and the Harvard extension, [Helmod](https://github.com/fasrc/helmod), was developed at TACC to address a number of problems that arise with large scientific module deployments, particularly the loading of incompatible modules built with different compilers, MPI libraries, etc.

Helmod uses many of the same commands that a Linux module system uses (`module load`, `module unload`, `module avail`), but enhances them with additional functionality.

### Helmod module names have 3 parts
Helmod modules must be loaded by name, though names can be partial.  Helmod module names are composed of the application name, the application version, and the release in the following form:

    <application name>/<application version>-<release>
    
An example might be our first release of the [2.2.4 version of bowtie2](https://github.com/BenLangmead/bowtie2/archive/v2.2.4.tar.gz):

    bowtie2/2.2.4-fasrc01
    
The application name and version number are determined by the authors.  The release represents a specific build within the Odyssey environment.  Changes to configuration parameters, dependent libraries, etc. will cause us to generate a new release.  Where possible these changes are described in the build comments that can be found during module searches (see below).

*A key feature of the Helmod system is that two different version-releases of the same application cannot be loaded at the same time*

A very common cause of problems in module systems is library mismatches due to the loading of incompatible versions.  While you can still enable applications manually (i.e. set PATH, etc. yourself), module load commands will swap out previously loaded versions.

### Helmod modules have a type
Helmod modules are one of three different types: *Core*, *Comp*, or *MPI*.

*Core* applications are constructed using the base operating system.  Compiled C, C++, or Fortran applications use the base gcc 4.4.7.  Architecture-independent applications are also Core.  These applications can be loaded directly.

*Comp* applications are compiler-dependent and cannot be loaded until the appropriate compiler is loaded.  For example, the blasr application cannot be compiled with the system gcc because it uses advanced C++ constructs. As a result, the compiler module must be loaded first.

    :::shell-session
    $ module load gcc/4.8.2-fasrc01 blasr/20151013-fasrc01
    
An attempt to load a new compiler after one has already been loaded will result in an error.
    
*MPI* applications depend on a specific MPI library module (e.g. openmpi/1.10.0-fasrc01).  Because MPI libraries themselves are compiler-dependent, an MPI application requires the loading of both the compiler and the MPI library modules.  For example:

    :::shell-session
    $ module load intel/15.0.0-fasrc01 openmpi/1.10.0-fasrc01 abyss/1.9.0-fasrc01 

The instructions for loading modules can be obtained by the search methods described below.

### Search for Helmod modules by portal web page...
The [RC/Informatics web portal Modules page](module_list>) provides a complete list of the Helmod modules deployed on Odyssey.  The Search box can be used to subset the list.  In addition to the module name that best matches your search term, other modules that may include that term in their description or in their dependency list, may be retrieved.

<figure>
	<a class="img" href="/images/module-page-search-libogg.png">
    		<img class="img-temp" src="/images/module-page-search-libogg.png"></img>
	</a>
    <figcaption>Portal search for libogg returns library and other matches.</figcaption>
</figure>

More than just the module name and application description is retrieved by a portal search.  As described below, some applications may require other modules to be loaded first; the necessary module load statements are shown for each version and release.  Differences in the way various releases are built are described in Build Comments where available.  Additional module dependencies loaded by the module are listed.

<figure>
	<a class="img" href="/images/module-search-page-netcdf.png">
    		<img class="img-temp" src="/images/module-search-page-netcdf.png"></img>
	</a>
    <figcaption>Portal search for netcdf shows build comments, module load statements.</figcaption>
</figure>

Some applications or libraries may be a part of a larger package.  For example, the [Numpy](http://www.numpy.org/) Python package is made available when the Anaconda module is loaded.  A search for this package will match the [Anaconda](https://www.continuum.io/why-anaconda) module due to the package listing in the description.

There are a number of application types that are best installed in user home directories and so may not be available as modules on Odyssey.  Applications delivered as Java jar files or pure Python applications are generally in this category.  Some of these applications may be returned when searching the module list, though, along with instructions to help with local user installation.

<figure>
	<a class="img" href="/images/module-search-page-khmer.png">
    		<img class="img-temp" src="/images/module-search-page-khmer.png"></img>
	</a>
    <figcaption>Portal search for khmer returns installation instructions.</figcaption>
</figure>


### ...or the module-query command line
While you're in an Odyssey terminal session, you can search for modules using the `module-query` command.  Running `module-query --help` will describe all of the options, but all you really need is a search term.  Using an application name like 'hdf5' will return a consolidated report of all of the modules that match the term.

<figure>
	<a class="img" href="/images/module-query-hdf5.png">
    		<img class="img-temp" src="/images/module-query-hdf5.png"></img>
	</a>
    <figcaption>Search for application name returns a list of modules.</figcaption>
</figure>

Any query for which a single record is returned (e.g. a query for a fully-specified module name) will provide more detail for that specific module, including module load statements and build comments.

 <figure>
	<a class="img" href="/images/module-query-hdf5-1.8.12.png">
    		<img class="img-temp" src="/images/module-query-hdf5-1.8.12.png"></img>
	</a>
    <figcaption>Single module report includes module build details.</figcaption>
</figure>
 
Full text queries can be done against the meta-data stored with the application and module records.  This can be used to search for modules that are dependent on the modules matching the search term or to look for general terms used in the application description text.  These searches are not particularly sophisticated and meta-data should not be expected to be comprehensive.

 <figure>
	<a class="img" href="/images/module-query-full-text.png">
    		<img class="img-temp" src="/images/module-query-full-text.png"></img>
	</a>
    <figcaption>Full text search matches text in the application description.</figcaption>
</figure>

Command line browsing of the full list of available modules can be done with the `module avail` command.  As described below in more detail, the modules listed by `module avail` can change based on what has already been loaded.  For example, if the `gcc/5.2.0-fasrc01` compiler module is loaded, an additional set of modules will become available.

 <figure>
	<a class="img" href="/images/module-avail-gcc.png">
    		<img class="img-temp" src="/images/module-avail-gcc.png"></img>
	</a>
    <figcaption>Module avail after loading gcc/5.2.0-fasrc01.</figcaption>
</figure>



### Helmod uses improved versions of the `module` commands
Like other module systems, Helmod uses `module` commands to enable, disable, and query applications.  Enabling an application that is not otherwise available requires a `module load`

<figure>
	<a class="img" href="/images/module-load-R.png">
    		<img class="img-temp" src="/images/module-load-R.png"></img>
	</a>
    <figcaption>module load R.</figcaption>
</figure>

In the case of the `module load R/3.2.0-fasrc01` command shown, the PATH environment variable is modified so that the R executable that is deployed at `/n/sw/fasrcsw/apps/Core/R_core/3.2.0-fasrc01` is available.

Loading more complex modules can affect a number of environment variables including `PYTHONPATH`, `LD_LIBRARY_PATH`, `PERL5LIB`, etc. Modules may also load dependencies. An application that uses Java may load the module for the appropriate Java interpreter. The `module list` command will show what is in your environment.

<figure>
	<a class="img" href="/images/module-load-trinityrnaseq.png">
    		<img class="img-temp" src="/images/module-load-trinityrnaseq.png"></img>
	</a>
    <figcaption>Load of module trinityrnaseq and changes to the environment.</figcaption>
</figure>

When an application name is used alone in a module load statement (without the version and release name components), the 'default' module will be loaded.  Generally the latest version-release is the default, but not in all cases.

Using a `module avail` command with an application name will show all of the modules that match along with a `(D)` next to the default module.  In the case of Python, the 2.7.6 version is the default, even though the 3.4.1 version is a later release.

<figure>
	<a class="img" href="/images/module-load-python.png">
    		<img class="img-temp" src="/images/module-load-python.png"></img>
	</a>
    <figcaption>Loading 'python' will activate the default 2.7.6 version.</figcaption>
</figure>

Note also that the Helmod python module is an alias for the Anaconda module (see below).

Tab-completion can be helpful when loading modules using the application name.  Typing `module load` with an application name followed by two tabs will provide a list of matching modules similar to the way file listings can be done with many bash commands.

Individual modules can be unloaded with the `module unload` command (tab completion works here as well) and your entire environment can be reset with the `module purge` command.


### Compiler-dependent (Comp) and MPI-dependent (MPI) modules are not available until the compiler or library is loaded.
It is common within large, shared academic clusters to find applications built with multiple compiler versions and MPI libraries.  Intel compilers and MPI libraries, for example, can take better advantage of CPU instruction sets, providing significant performance boosts to computationally-intensive tools.  However, Intel compilers can fail to properly build other applications that are developed with the far more common gcc compilers.  Loading modules built with different compilers can often lead to errors that are difficult to diagnose.

The Helmod system, based on TACC's Lmod, does not enable applications built with a non-standard compiler unless the relevant compiler module has been loaded.  For example, an attempt to load the [Atlas](http://math-atlas.sourceforge.net/) libraries on Odyssey will result in the following error message:

    Lmod has detected the following error: 
    These module(s) exist but cannot be loaded as requested: "atlas/3.10.2-fasrc02"

A check using the [portal search page](module_list>) or the `module-query` tool will show that Atlas is a Comp module that was built with either the Intel 15 compiler or the gcc 4.8.2 compiler.  Loading one of those first will allow the Atlas library to be loaded.

<figure>
	<a class="img" href="/images/module-load-atlas.png">
    		<img class="img-temp" src="/images/module-load-atlas.png"></img>
	</a>
    <figcaption>Load a compiler first for a Comp application or library.</figcaption>
</figure>

MPI-dependent applications are enabled in a similar way, but, because MPI libraries themselves are compiler dependent, both compiler and MPI library modules must be loaded before an application can be used.

<figure>
	<a class="img" href="/images/module-load-abyss.png">
    		<img class="img-temp" src="/images/module-load-abyss.png"></img>
	</a>
    <figcaption>Load a compiler and MPI library before loading an MPI application .</figcaption>
</figure>

### Some modules are aliases of others
When modules are built in RC, the application name usually follows the name of the distribution package to ensure that the build process is as smooth as possible.  Sometimes, the distribution name (e.g. jdk) is not how the package is commonly known (java).  For the more common cases, alias packages are created that simply load another package using a different name.

### Some Helmod modules are setup with 'wiggle room' in their dependencies.
Many modules depend on other modules, but that dependency is not precisely tied to a specific version-release combination.  For example, a module that depends on the Perl interpreter may function just fine with Perl versions 5.8 through 5.20.  As a result, these modules have been coded to determine whether the application has already been loaded and, if it is, do nothing.  

The use of 'wiggle room' in dependency resolution prevents modules from being artificially incompatible.  On occasion, however, unintended problems can arise when, for example, a much newer version of a dependency is loaded.  If you see compatibility errors, check to see what is actually loaded in your environment with the `module list` command.  Changing the order of module loading can alleviate most of these problems. 


## Python should be used within an Anaconda environment
Python is an extremely popular interpreted programming language that has an array of excellent packages for scientific computing.  It is not uncommon to see module systems on academic clusters provide some of the major Python packages like scipy and numpy.  However, in our experience, this leads to complex `PYTHONPATH`s that, especially without Helmod version resolution, can create incompatible environments.

Use of the [Anaconda](http://docs.continuum.io/anaconda/index) distribution from Continuum Analytics makes local control of Python package sets much easier.  In addition to a large set of pre-installed packages, it is easy to create a local environment in your home directory and use that to define your environment.

You can use Python and Anaconda on Odyssey by running:

    module load python/2.7.6-fasrc01
    
(as of this writing, 2.7.6 is the Odyssey Python default).  Loading this python module will load the 1.9.2 version of the Anaconda distribution.

Anaconda has a concept of *environments* that can be used to manage alternative package sets and versions.  This analogous to the environments that can be setup with [virtualenv](https://pypi.python.org/pypi/virtualenv). For example, if you want newer versions of some packages in the default environment, you can make a new environment with your customizations.

First, load the base environment:

    :::shell-session
    $ module load python/2.7.6-fasrc01

Then create a new environment by cloning the Anaconda distribution (substitute `ENV_NAME` with whatever name you wish):

    :::shell-session
    $ conda create -n ENV_NAME --clone="$PYTHON_HOME"

This will create a clone in your home directory under `~/envs/ENV_NAME`.  

Use this environment by running the command:

    :::shell-session
    $ source activate ENV_NAME


If you want to use this environment all the time, add the above line to your `~/.bashrc` (or other appropriate shell config file) after the line that loads the module.

To stop using the custom environment, run:

    :::shell-session
    $ source deactivate

A Python 3 module is available as well via the Anaconda3 distribution.  The Anaconda system allows you to alter your environment to setup a [specific version of Python](http://conda.pydata.org/docs/py2or3.html#install-a-different-version-of-python) very easily.

For more details on installing and updating Anaconda packages within the Odyssey environment, see the [Python on Odyssey]({filename}/python-on-odyssey.html) page.

## Local package installs should be done for Perl, R, etc.
The Odyssey support model for interpreted languages like Perl and R is similar to that of Python.  We provide the interpreter and a base install of common packages via a module, but then encourage local installs of additional packages.  This reduces the size of the software install burden and allows users to tailor their environment according to their specific needs.

For more information on local installation of packages, see the relevant documentation page.

* [Perl]({filename}/perl-on-odyssey.html)
* [R]({filename}/r-on-odyssey.html)

The [Software category page]({filename}/category/software.html) may also be of some assistance.


## Java applications are easy to run
Most Java applications are distributed as jar files with few if any external libraries.  As a result, most can be downloaded and run directly assuming you have loaded the correct jdk / java interpreter.

    [akitzmiller@builds ~]$ wget http://www.usadellab.org/cms/uploads/supplementary/Trimmomatic/Trimmomatic-0.35.zip
    --2015-11-23 12:12:16--  http://www.usadellab.org/cms/uploads/supplementary/Trimmomatic/Trimmomatic-0.35.zip
    Resolving www.usadellab.org... 199.195.142.183
    Connecting to www.usadellab.org|199.195.142.183|:80... connected.
    HTTP request sent, awaiting response... 200 OK
    Length: 129810 (127K) [application/zip]
    Saving to: “Trimmomatic-0.35.zip”
    
    100%[=========================================================================================>] 129,810      438K/s   in 0.3s    
    
    2015-11-23 12:12:16 (438 KB/s) - “Trimmomatic-0.35.zip” saved [129810/129810]
    
    
    [akitzmiller@builds ~]$ unzip Trimmomatic-0.35.zip 
    Archive:  Trimmomatic-0.35.zip
       creating: Trimmomatic-0.35/
      inflating: Trimmomatic-0.35/LICENSE  
      inflating: Trimmomatic-0.35/trimmomatic-0.35.jar  
       creating: Trimmomatic-0.35/adapters/
      inflating: Trimmomatic-0.35/adapters/NexteraPE-PE.fa  
      inflating: Trimmomatic-0.35/adapters/TruSeq2-PE.fa  
      inflating: Trimmomatic-0.35/adapters/TruSeq2-SE.fa  
      inflating: Trimmomatic-0.35/adapters/TruSeq3-PE-2.fa  
      inflating: Trimmomatic-0.35/adapters/TruSeq3-PE.fa  
      inflating: Trimmomatic-0.35/adapters/TruSeq3-SE.fa  
    
    [akitzmiller@builds ~]$ java -jar ~/Trimmomatic-0.35/trimmomatic-0.35.jar 
    Usage: 
           PE [-threads <threads>] [-phred33|-phred64] [-trimlog <trimLogFile>] [-quiet] [-validatePairs] [-basein <inputBase> | <inputFile1> <inputFile2>] [-baseout <outputBase> | <outputFile1P> <outputFile1U> <outputFile2P> <outputFile2U>] <trimmer1>...
       or: 
           SE [-threads <threads>] [-phred33|-phred64] [-trimlog <trimLogFile>] [-quiet] <inputFile> <outputFile> <trimmer1>...
    

