Title: GNU Screen
Date: 2014-06-23
Category: software
Tags: Linux, Odyssey
Summary: Using the GNU Screen terminal multiplexer to maintain persistent terminal session on Odyssey.

[GNU screen](http://www.gnu.org/software/screen/) is a terminal multiplexer. It allows you to start a shell session in a terminal that you can connect to simultaneously from multiple login sessions and persists on the server even when you're not logged in. For example, from your laptop you can log into the cluster, start a screen session, and fire off a long-running program that prints output to the display.

You can then shutdown your laptop, go home, log in to the cluster from a different computer, attach to the screen session, and continue to interact with your program.

<em><strong>NOTE</strong>: Since we have many login nodes, you will need to make note of which one you start your screen session on and return to that machine to re-connect to your screen session. If you're unsure what machine you're on, type `uname -a` (example: rclogin04 - you would would then ssh directly to rclogin04.rc.fas.harvard.edu when you return)</em>

This is only one example of how screen can be used. For example, if you leave your laptop on and attached to the screen, the same output will appear in both login sessions on both computers.

You can also allow other users to connect to your screen (read-only or read-write) so that they can watch what you do and even collaborate with you. One thing to remember about screen is that you have to start a session *before* you start a long-running program; you cannot put a program in a screen session after it has started (see below for something that crudely approximates the effect).

### Basic Usage
Screen sessions can be given names to easily identify them.
Commands and control characters given to screen itself must be differentiated from what's passed to what screen is running, therefore all screen commands begin by typing `ctrl-a`.

That's the `ctrl` key and the letter `a` at the same time.

### Start a New Screen Session
To start a new screen named *mywork*, use the following shell command:

    :::bash
    screen -S mywork
    
This will start a new shell session, replacing anything you previously had in the window.

If you type `exit`, the screen will terminate and you'll be returned to your previous shell session.

### Detaching from a Screen Session
In order to disconnect your client and be able to attach to the screen session later, you must leave the screen session running.

You do this by *detaching* from it.

Use the following screen command:

    ctrl-a d
You can do this either when while it's idle at a shell prompt or while some program is running in the foreground. You will be returned to your original shell session, and anything running in your screen session will continue to run in the background.

You can now exit the shell session and shutdown your computer.

*Do **not** run `exit` or `logout` while inside the screen session, if you plan on reattaching to it later. These commands will terminate the screen session.*

### Attach to an Existing Screen Session
You can list your running screen sessions with the following shell command:

    :::bash
    screen -ls
For example, following the above example, you should see something like:

    :::bash 
    [hptc@iliadaccess01 workshop]$ screen -ls
        
    There is a screen on:

    12954.mywork (Detached)
    1 Socket in /var/run/screen/S-hptc.


You can reattach to it with the following shell command:

    :::bash
    screen -x mywork
    
Your ssh client display will fill with what's currently running the in the screen.

You can also attach to screens that are already attached to from other sessions.
Anything you type, and anything that your programs print, will appear on all attached clients simultaneously.

### Scrollback and Copy-n-Paste
Screen sessions have their own output buffers, independent of your original terminal or ssh client. That means if you use the scroll bar, you will not be scrolling back through the output in the screen session. In order to scroll back within the screen, you can enter scrollback/copy mode by issuing the screen command:

    ctrl-a [
You can then use the arrow keys, page up/down keys, etc. to move around.

To exit scrollback/copy mode without copying anything, just hit `[`.

If you want to copy text that appears on the display, the normal terminal method should work.
If you want to copy pages of text and need to scroll through the screen to do so, move the cursor to the start of what you want to copy, hit `spacebar`, and move the cursor to the end of the selection and hit `spacebar` again. That'll exit scrollback/copy mode.

Use

    ctrl-a ]
to paste your selection.

### Sharing a Screen Session
You can allow other users to connect to your screen session by putting it in multiuser mode.
You can also set access control lists to allow only read-only access.
To do so for a user named *joe*, enter the following commands:

    :::bash
    ctrl-a :multiuser on
    ctrl-a :acladd guest
    ctrl-a :aclchg guest -wx "#,?"
    ctrl-a :aclchg guest +x "colon,wall,detach"

If your username is *john*, and your screen is named *mywork*, user joe can connect to it by running:

    :::bash
    screen -x john/mywork
    
### What Can You Do If You Forget To Start a Screen Session?
You cannot retroactively put a program in a screen session. However, you can do some tricks to effectively detach from a running program and resume it in the background, writing output to files instead of the display, so that you can log off and shutdown your client computer.

Note that this actually has nothing to do with the screen program.

First, find the process ID the process you want to detach from, using the `ps` command.

Say it's PID 12345.

Attach to the process using the GNU debugger by starting a separate shell session, `cd`-ing to a directory that you want your program to write files to, and issuing the following command:
`gdb 12345`

In the `gdb` session, run the following `call` commands to redirect the program's stdout and stderr to files myprog.stdout and myprog.stderr:

    :::bash
    (gdb) call creat("myprog.stdout", 0600)
    $1 = 3
    (gdb) call dup2(3, 1)
    $2 = 1
    (gdb) call creat("myprog.stderr", 0600)
    $3 = 4
    (gdb) call dup2(4, 2)
    $4 = 2

Hit `ctrl-d` to exit gdb.

Back in the shell session where the original program is running, pause the process, resume it in the background, and then disown it with the following key sequences and commands:

    :::bash
    ctrl-z
    bg
    disown

You can then exit the shell session, and your program will continue to run, writing to the files noted above.

You can then reconnect from a different session and run the command:

    :::bash
    ( tail -f myprog.stdout & ) && ( tail -f myprog.stderr & )

to watch the output.

However, there is no way (that I know of) to reattach interactively.