Title: Unix Permissions
Date: 2014-06-23
Category: software
Tags: Linux
Summary: Manipulating permissions on Linux files and directories.

### In Unix, how do I change the permissions for a file?
You can change file permissions with the `chmod` command. In Unix, file permissions, which establish who may have different types of access to a file, are specified by both access classes and access types. Access classes are groups of users, and each may be assigned specific access types. The access classes are "user", "group", "other", and "all". These refer, respectively, to the user who owns the file, a specific [group](http://kb.iu.edu/data/aeqw.html) of users, the other remaining users who are not in the group, and all three sets of users. Access types (read, write, and execute) determine what may be done with the file by each access class. 

There are two basic ways of using `chmod` to change file permissions:

### Symbolic method

The first and probably easiest way is the relative (or symbolic) method, which lets you specify access classes and types with single letter abbreviations. A `chmod` command with this form of syntax consists of at least three parts from the following lists:

<table cellpadding="4"><colgroup><col> <col> <col></colgroup>
<tbody>
<tr valign="top">
<th id="idm11031064" align="left">Access Class</th>
<th id="idp8943168" align="left">Operator</th>
<th id="idp4204480" align="left">Access Type</th>
</tr>
<tr valign="top">
<td id="idm11252520" align="left">u (user)</td>
<td id="idp897080" align="left">+ (add access)</td>
<td id="idp7055552" align="left">r (read)</td>
</tr>
<tr valign="top">
<td id="idp1686872" align="left">g (group)</td>
<td id="idp5782704" align="left">- (remove access)</td>
<td id="idp7516552" align="left">w (write)</td>
</tr>
<tr valign="top">
<td id="idp3362584" align="left">o (other)</td>
<td id="idp8641016" align="left">= (set exact access)</td>
<td id="idp13808520" align="left">x (execute)</td>
</tr>
<tr valign="top">
<td id="idp1686576" align="left">a (all: u, g, and o)</td>
</tr>
</tbody>
</table>

For example, to add permission for everyone to read a file in the current directory named `myfile`, at the Unix prompt, you would enter: 

    :::bash
    chmod a+r myfile
    
The ` a ` stands for "all", the ` + ` for "add", and the ` r ` for "read". 

**Note:** This assumes that everyone already has access to the directory where `myfile` is located and its parent directories; that is, you must set the directory permissions separately. 

If you omit the access class, it's assumed to be all, so you could also enter the previous example as: 

    :::bash
    chmod +r myfile
    
You can also specify multiple classes and types with a single command. For example, to remove read and write permission for group and other users (leaving only yourself with read and write permission) on a file named `myfile`, you would enter: 

    :::bash
    chmod go-rw myfile 

You can also specify that different permissions be added and removed in the same command. For example, to remove write permission and add execute for all users on `myfile`, you would enter: 

    :::bash
    chmod a-w+x myfile 

In each of these examples, the access types that aren't specified are unchanged. The previous command, for example, doesn't change any existing settings specifying whether users besides yourself may have read (` r `) access to `myfile`. You could also use the exact form to explicitly state that group and other users' access is set only to read with the ` = ` operator: 

    :::bash
    chmod go=r myfile

The `chmod` command also operates on directories. For example, to remove write permission for other users on a subdirectory named `mydir`, you would enter: 

    :::bash
    chmod o-w mydir

To do the same for the current directory, you would enter: 

    :::bash
    chmod o-w 
    
Be careful when setting the permissions of directories, particularly your home directory; you don't want to lock yourself out by removing your own access. Also, you must have execute permission on a directory to switch (` cd `) to it.

### Absolute form
The other way to use the `chmod` command is the absolute form. In this case, you specify a set of three numbers that together determine all the access classes and types. Rather than being able to change only particular attributes, you must specify the entire state of the file's permissions. 

The three numbers are specified in the order: user (or owner), group, other. Each number is the sum of values that specify read (4), write (2), and execute (1) access, with 0 (zero) meaning no access. For example, if you wanted to give yourself read, write, and execute permissions on `myfile`; give users in your group read and execute permissions; and give others only execute permission, the appropriate number would be calculated as (4+2+1)(4+0+1)(0+0+1) for the three digits 751. You would then enter the command as:

    :::bash
    chmod 751 myfile
 
As another example, to give only yourself read, write, and execute permission on the current directory, you would calculate the digits as (4+2+1)(0+0+0)(0+0+0) for the sequence 700, and enter the command: `chmod 700` If it seems clearer to you, you can also think of the three digit sequence as the sum of attributes you select from the following table:

<table cellpadding="4"><colgroup><col> <col></colgroup>
<tbody>
<tr valign="top">
<td id="idp3309768" align="left">400</td>
<td id="idp5287264" align="left">Read by owner</td>
</tr>
<tr valign="top">
<td id="idp7888016" align="left">200</td>
<td id="idp8825592" align="left">Write by owner</td>
</tr>
<tr valign="top">
<td id="idp13455448" align="left">100</td>
<td id="idp13455736" align="left">Execute by owner</td>
</tr>
</tbody>
</table>
<table cellpadding="4"><colgroup><col> <col></colgroup>
<tbody>
<tr valign="top">
<td id="idp5753128" align="left">040</td>
<td id="idp8492712" align="left">Read by group</td>
</tr>
<tr valign="top">
<td id="idp8493152" align="left">020</td>
<td id="idp3308824" align="left">Write by group</td>
</tr>
<tr valign="top">
<td id="idp1633112" align="left">010</td>
<td id="idp1633352" align="left">Execute by group</td>
</tr>
</tbody>
</table>
<table cellpadding="4"><colgroup><col> <col></colgroup>
<tbody>
<tr valign="top">
<td id="idp5054792" align="left">004</td>
<td id="idp5411424" align="left">Read by others</td>
</tr>
<tr valign="top">
<td id="idp5411752" align="left">002</td>
<td id="idp3026184" align="left">Write by others</td>
</tr>
<tr valign="top">
<td id="idp3026520" align="left">001</td>
<td id="idp8762808" align="left">Execute by others</td>
</tr>
</tbody>
</table>

To create an access mode, sum all the accesses you wish to permit. For example, to give read privileges to all, and write and execute privileges to the owner only for a file, you would sum: 400+200+100+040+004 = 744. Then, at the Unix prompt, you would enter: 

    :::bash
    chmod 744 myfile.ext
    
Some other frequently used examples are:

<table cellpadding="4"><colgroup><col> <col></colgroup>
<tbody>
<tr valign="top">
<td id="idp5333784" align="left">777</td>
<td id="idp5333944" align="left">anyone can do anything (read, write, or execute)</td>
</tr>
<tr valign="top">
<td id="idp7053672" align="left">755</td>
<td id="idp7053832" align="left">you can do anything; others can only read and execute</td>
</tr>
<tr valign="top">
<td id="idm12278240" align="left">711</td>
<td id="idm12278096" align="left">you can do anything; others can only execute</td>
</tr>
<tr valign="top">
<td id="idm12277712" align="left">644</td>
<td id="idp1103336" align="left">you can read and write; others can only read</td>
</tr>
</tbody>
</table>

### **More information**

For more information about `chmod`, consult the manual page.  At the Unix prompt, enter: `man chmod`