Title: Find-n-Replace
Date: 2014-06-23
Category: software
Tags: Linux
Summary: Combinations of the `find`, `xargs`, `grep`, and `sed` commands allow you to recursively search for, and replace, strings of text in your files.

Combinations of the `find`, `xargs`, `grep`, and `sed` commands allow you to recursively search for, and replace, strings of text in your files. The `find` command prints out names of files, and the `xargs` command reads them and passes them as arguments to another command (e.g. `grep` or `sed`). In order to handle filenames with spaces and other special characters in them, the options `-print0` and `-0` are used. 

For example, we're currently migrating home directories to new filesystems, and users with `/n/home` hardcoded in scripts will have to modify them. In the following, the string `/n/home/$USER\b` is a _regular expression_ that matches the string `/n/home/$USER`, were `$USER` will automatically be filled in by your username, followed by a _word boundary_ (i.e., if my username is `joe`, it won't match `/n/home/joel`). 

To recursively search all the files in the current working directory for all occurrences of your former home directory explicity written out, you can use this command: 

    :::bash
    find . -type f -print0 | xargs -0 grep --color "/n/home/$USER\b"
    
The `grep` command searches text for strings matching regular expressions. Add the option `-l` to `grep` if you only want to list the names of the files that match, as opposed to print the full line of text that contains the match. To replace all those occurrences with the string `~`, you can use the following: 

    :::bash
    find . -type f -print0 | xargs -0 sed -i "s?/n/home/$USER\b?~?g" 
    
The `sed` command is used to make the text substitution — the stuff between the first two ?s is what to replace, and the stuff between the second two `?`s is what to replace it with. The `g` after that says replace all occurrences, not just the first on each line. As with any operation that could modify all your files, **_use this with care_**, maybe on some test files first, to make sure it's doing what you expect it to do. Using `find`'s `-exec` option, which you may see documented in other contexts, is an alternative to combining it with `xargs`.

