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

### Helmod module names have 3 parts
Helmod modules must be loaded by name, though names can be partial.  Helmod module names are composed of the application name, the application version, and the release in the following form:

    <application name>/<application version>-<release>
    
An example might be our first release of the [2.2.4 version of bowtie2](https://github.com/BenLangmead/bowtie2/archive/v2.2.4.tar.gz):

    bowtie2/2.2.4-fasrc01
    
The application name and version number are determined by the authors.  The release represents a specific build within the Odyssey environment.  Changes to configuration parameters, dependent libraries, etc. will cause us to generate a new release.  Where possible these changes are described in the build comments that can be found during module searches (see below).

*A key feature of the Helmod system is that two different version-releases of the same application cannot be loaded at the same time*

A very common cause of problems in module systems is library mismatches due to the loading of incompatible versions.  While you can still enable applications manually (i.e. set PATH, etc. yourself), module load commands will swap out previously loaded versions.

### Helmod modules have a type
As described in more detail below, Helmod modules are one of three different types: Core, Comp, or MPI.

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

<figure>
	<a class="img" href="/images/module-search-page-numpy.png">
    		<img class="img-temp" src="/images/module-search-page-numpy.png"></img>
	</a>
    <figcaption>Portal search for numpy returns the Anaconda module.</figcaption>
</figure>

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



### Helmod uses improved versions of the `module`, commands
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

<figure>
	<a class="img" href="/images/module-unload-purge.png">
    		<img class="img-temp" src="/images/module-unload-purge.png"></img>
	</a>
    <figcaption>Remove modules from your environment.</figcaption>
</figure>

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

## Python should be used within an Anaconda environment

## Graphical applications can be run from within a NoMachine desktop

## GPUs can be used via CUDA libraries

## Java applications are easy to run


