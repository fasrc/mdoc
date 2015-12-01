Title: Python on Odyssey
Date: 2015-11-30
Category: software
Tags: Python, Anaconda
Summary: Using Python on Odyssey with the Anaconda distribution.

## You can use python setup.py install as well.
## Don't use --local


At this point you can upgrade or install a package named `PACKAGE` with either `pip install` or the `conda install` command (it's the same whether installing or upgrading):

    :::shell-session
    $ conda install PACKAGE

The main difference between a `conda install` and a `pip install` is that conda packages may contain pre-compiled binaries built from other languages (e.g. C, C++).  While this can be very handy if the binaries were built with a compatible compiler and libraries, it can be a problem if the authors included files incompatible with the Odyssey system.

The commands `conda list` and `conda show`, list installed and available packages, respectively.  See the [conda documentation](http://conda.pydata.org/docs/index.html) for all the details.  

*Anaconda generally has the lastest versions of all packages that are compatible.  When you install an extra package, it'll often update core packages like numpy and scipy; other packages may then downgrade them back.  This is why we recommend sticking to the default environment if possible.*

If you have problems updating a package that is already installed in the Anaconda environment, you might need to remove the package first:

    :::shell-session
    $ conda remove PACKAGE

In most cases, this will 'unlink' the package from the source distribution.  You can then install a new one, either with `conda` or `pip` install commands.

This will often bypass update errors, especially with certain versions of `matplotlib`.


