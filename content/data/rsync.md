Title: rsync
Date: 2014-06-23
Category: data
Tags: Linux, Odyssey
Summary: Rsync is a fast, versatile, remote (and local) file-copying tool.

Rsync is a fast, versatile, remote (and local) file-copying tool. It is famous for its delta-transfer algorithm, which reduces the amount of data sent over the network by sending only the differences between the source files and the existing files in the destination. It is available on most Unix-like systems, including the Odyssey cluster and Mac OS X. 

The basic syntax is: `rsync SOURCE DESTINATION` where `SOURCE` and `DESTINATION` are filesystem paths. 

They can be local, either absolute or relative to the current working directory, or they can be remote but prefixing something like `USERNAME@HOSTNAME:` to the front of them. 

Unlike `cp` and most shell commands, a trailing `/` character on a directory name is significant — it means the _contents_ of the directory as opposed to the directory itself.

### Examples

#### As a replacement for `cp` — copying a single large file, but with a progress meter

    :::bash
    rsync --progress bigfile bigfile-copy

#### Make a recursive copy of local directory `foo` as `foo-copy`

    :::bash
    rsync -av foo/ foo-copy/

The trailing slash on `foo-copy/` is optional, but if it's not on `foo/`, the file `foo/myfile` will appear as `foo-copy/foo/myfile` instead of `foo-copy/myfile`.

#### Upload the directory foo on the local machine to your home directory on Odyssey

    :::bash
    rsync -avz foo/ MYUSERNAME@odyssey.fas.harvard.edu:~/foo/

This works for individual files, too, just don't put the trailing slashes on them.

#### Download the directory foo in your home directory on Odyssey to the local machine

    :::bash
    rsync -avz MYUSERNAME@odyssey.fas.harvard.edu:~/foo .

#### Update a previously made copy of foo on Odyssey after you've made changes to the local copy

    :::bash
    rsync -avz --delete foo/ MYUSERNAME@odyssey.fas.harvard.edu:~/foo/

The `--delete` option has no effect when making a new copy, and therefore can be used the previous example, too (making the commands identical), but since it recursively deletes files, it's best to use it sparingly.

#### Update a previously made copy of foo on Odyssey after you or someone else has already updated it from a different source

    :::bash
    rsync -avz --update foo/ MYUSERNAME@odyssey.fas.harvard.edu:~/foo/

The `--update` options has no effect when making a new copy, and can freely be specified in that case, also.

#### Make a backup of your entire linux system to `/mnt/MYBACKUPDRIVE`

    :::bash
    rsync -a --exclude /proc/ --exclude /sys/ --exclude /tmp/ --exclude /var/tmp/ --exclude /mnt/ --exclude /media/ /mnt/MYBACKUPDRIVE

Add additional `--exclude` options, if appropriate. See [rdiff-backup](http://rc.fas.harvard.edu/tipsandtricks/rdiff-backup) for a better way of making backups.

### Compression

If the `SOURCE` and `DESTINATION` are on different machines with fast CPUs, especially if they're on different networks (e.g. your home computer and the Odyssey cluster), it's recommended to add the `-z` option to compress the data that's transferred. This will cause more CPU to be used on both ends, but it is usually faster.

### File Attributes, Permissions, Ownership, etc.

By default, `rsync` does not copy recursively, preserve timestamps, preserve non-default permissions, etc. 

There are individual options for all of these things, but the option `-a`, which is short for archive mode, sums up many of these (`-rlptgoD`) and is best for producing the most exact copy. (`-A` (preserve ACLs), `-X` (preserve extended attributes), and `-H` (preserve hardlinks) may also be desired on rare occasions.) 

Note that if your are copying files not owned by you, preserving file ownership only works if you are root at the destination. If you are copying between systems on different authentication infrastructures, and the user/group does not exist at the destination, the numeric id is used. If that numeric id corresponds to a different user/group, the files will appear to be owned by that other user/group. If the user/group does exist on the destination, and the numeric id is different, the numeric id changes accordingly. The option `--numeric ids` changes this behavior, but introduces some issues of its own, so is not recommended by default.

### Updating a Copy

Rsync's delta-transfer algorithm allows you to efficiently update copies you've previously made by only sending the differences needed to update the `DESTINATION` instead of re-copying it from scratch. However, there are some addition options you will probably want to use depending on the type of copy you're trying to maintain. 

If you want to maintain a _mirror_, i.e. the `DESTINATION` is to be an exact copy of the `SOURCE`, then you will want to add the `--delete` option. This deletes stuff in the `DESTINATION` that is no longer in the `SOURCE` 

_Be careful with this option! If you incorrectly specify the `DESTINATION` you may accidentally delete many files._ 

See also the `--delete-excluded` option if you're adding `--exclude` options that were not used when making the original copy. If you're updating a master copy, i.e. the `DESTINATION` may have files that are newer than the versions in `SOURCE`, you will want to add the `--update` option. This will leave those files alone, not revert them to the older copy in `SOURCE`.

### Progress, Verbosity, Statistics

*   `-v` Verbose mode — list each file transferred. Adding more `v`s makes it more verbose.
*   `--progress` Show a progress meter for each file transfer (not a progress meter for the whole operation). If you have many small files, this can significantly slow down the transfer.
*   `--stats` Print a short paragraph of statistics at the end of the session, like average transfer rate, total numbers of files transferred, etc.

### Other Useful Options

*   `--dry-run` Perform a dry-run of the session instead of actually modifying the DESTINATION. Most useful when adding multiple `-v` options, especially for verifying `--delete` is doing what you want.
*   `--exclude PATTERN` Skip some parts of the `SOURCE`.