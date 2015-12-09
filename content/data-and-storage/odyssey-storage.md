Title: Odyssey Storage
Date: 2015-11-10
Category: Data and Storage
Tags: Odyssey, Storage
Summary: Details about the various types of storage and file systems on Odyssey.

Research Computing maintains multiple petabytes of storage in association with the Odyssey cluster. This storage is not uniform, however, and each class of storage is designed and maintained with different purposes in mind. This page describes cluster storage in detail as a guide for day-to-day usage. Please see the terminology section at the end of this document for clarification on any unfamiliar terms.

### Home Directory Storage
`/n/home*` directories are your primary storage location
<table style="margin-bottom: 0; width: 600px;" align="center">
<tbody>
<tr>
<th style="width: 200px;">Size limit</th>
<td>40 GB (Hard Limit)</td>
</tr>
<tr>
<th>Availability</th>
<td>All cluster nodes.
Can be mounted on desktops and laptops.</td>
</tr>
<tr>
<th>Backup</th>
<td>Daily. Kept for 2 weeks.</td>
</tr>
<tr>
<th>Retention policy</th>
<td>Indefinite</td>
</tr>
<tr>
<th>Performance</th>
<td>Moderate
<strong>Not appropriate for I/O intensive or large numbers of jobs. Not expandable.</strong></td>
</tr>
<tr>
<th>Cost</th>
<td>Free</td>
</tr>
</tbody>
</table>

Every user of the Odyssey cluster receives a 40 GB home directory. This is the main location used for everyday data storage for analysis and data processing. Your initial working directory upon login is your home. The directories are of the form `/n/homeNN/XXXX` where `homeNN` is `home01`-`home15` and `XXXX` is your login.

Your home volume has good performance for most tasks. However, **I/O intensive or large numbers of jobs should not be processed in home directories.** Widespread computation against home directories would result in poor performance for all users. For these types of tasks one of the "scratch" filesystems is better suited.

The home directory is exported from the disk arrays using CIFS/SMB file protocols, and so can be mounted as a 'shared' volume on your desktop or laptop. Please see [this help document](access-and-login.html#mounting-odyssey-storage-like-home-directories-and-lab-shares-on-your-desktop) for step-by-step instructions.

Home directories are backed up into a directory called `.snapshot` in your home. *This directory will not appear in directory listings. You can `cd` or `ls` this directory specifically to make it visible*. Contained herein are copies of your home directory in date specific subdirectories. Hourly, daily, weekly snapshots can be found. To restore older files, simply copy them from the correct .snapshot subdirectory.

The 40 GB quota is enforced with a combination of a soft quota at 40 GB and a hard quota at 41 GB. Going over quota often manifests in funny ways. Hitting quota during processing of large data sets can result in file write/read failures or segmentation faults.

When attempting to login to a home directory that is over quota, you will often get an error in the .Xauthority file:

    :::bash
    /usr/bin/xauth: error in locking authority file .Xauthority</div>

At this point, you will need to remove unneeded files. You may be able to use some `/scratch` space to assist with archiving (tar / zip) rarely used files.

### Lab Storage
<table style="margin-bottom: 0; width: 600px;" align="center">
<tbody>
<tr>
<th style="width: 200px;">Size limit</th>
<td>None</td>
</tr>
<tr>
<th>Availability</th>
<td>Varies among cluster nodes.
Most can be mounted on desktops and laptops.</td>
</tr>
<tr>
<th>Backup</th>
<td>Varies, but typically up to 2 weeks. Labs are explicitly notified if disk shares are not routinely backed up.</td>
</tr>
<tr>
<th>Retention policy</th>
<td>Indefinite</td>
</tr>
<tr>
<th>Performance</th>
<td>Moderate
<strong>Not appropriate for I/O intensive or large numbers of jobs</strong></td>
</tr>
<tr>
<th>Cost</th>
<td>1 Tb at $0 cost, expansion on a TB basis available for purchase</td>
</tr>
</tbody>
</table>

Each laboratory using the Odyssey cluster is granted an initial storage allocation of 1 Tb. These conventional disk arrays are mounted via NFS and can be used for a variety of purposes. Laboratories may purchase additional storage and backup space as needed. Contact [rchelp](rchelp>) to get details.

Your lab volume has good performance for most tasks. However, **I/O intensive or large numbers of jobs should not be processed in these directories.** Widespread computation against these directories would result in poor performance for all users. For these types of tasks one of the "scratch" filesystems is better suited.

Most lab directories are exported from the disk arrays using CIFS/SMB file protocols, and so can be mounted as a 'shared' volume on your desktop or laptop. Please see [this help document](access-and-login.html#mounting-odyssey-storage-like-home-directories-and-lab-shares-on-your-desktop) for step-by-step instructions. For groups handling HRCI, this option may not be available.

### Local (per node), Shared Scratch Storage

Each node contains a disk partition `/scratch`, and is useful for large temp files created while an application is running.
<table style="margin-bottom: 0; width: 600px;" align="center">
<tbody>
<tr>
<th style="width: 200px;">Size limit</th>
<td>270 Gb total available / node</td>
</tr>
<tr>
<th>Availability</th>
<td>Node only.
Cannot be mounted on desktops/laptops.</td>
</tr>
<tr>
<th>Backup</th>
<td>Not backed up</td>
</tr>
<tr>
<th>Retention policy</th>
<td>Not retained</td>
</tr>
<tr>
<th>Performance</th>
<td>High: Suited for limited I/O intensive jobs</td>
</tr>
</tbody>
</table>

The `/scratch` volumes are a directly connected (and therefore, fast), temporary storage location that is local to the compute nodes. Many high performance computing applications use temporary files that go to /tmp by default. However, /tmp is on the system disk, a relatively small volume on Odyssey. Network-attached storage, like home directories, is slow compared to disks directly connected to the compute node. If you can direct your application to use /scratch for temp files, you can gain significant performance improvements and ensure that large files can be supported.

Though there are `/scratch` directories available to each compute node, they are not the same volume. *The storage is specific to the host and is not shared.* Files written to /scratch from holy2a18206, for example, are only visible on that host. `/scratch` should only be used for temporary files written and removed during the running of a process. Although a 'scratch cleaner' does run daily, we ask that at the end of your job you delete the files that you've created.

### Networked, High-performance Shared (Scratch) Storage

Odyssey has storage built specifically for high-performance temporary use. Simply make your own folder inside the folder of your lab group. If that doesn't exist, contact [RCHelp](rchelp>).
#### `regal`
`/n/regal` is additional short-term, shared space for large data analysis projects
<table style="margin-bottom: 0; width: 600px;" align="center">
<tbody>
<tr>
<th style="width: 200px;">Size limit</th>
<td>1.2 Pb total</td>
</tr>
<tr>
<th>Availability</th>
<td>All cluster nodes.
Cannot be mounted on desktops/laptops.</td>
</tr>
<tr>
<th>Backup</th>
<td>Not backed up</td>
</tr>
<tr>
<th>Retention policy</th>
<td>90 days. Retention deletions are run during the cluster maintenance window.</td>
</tr>
<tr>
<th>Performance</th>
<td>High: Appropriate for I/O intensive jobs</td>
</tr>
</tbody>
</table>

The `/n/regal` filesystem is managed by the [Lustre](lustre>) parallel file system and provides excellent performance for HPC environments. This file system can be used for data intensive computation, but must be considered a temporary store. Files are not backed up and will be removed after 90 days.

Large data analysis jobs that would fill your 40 Gb of home space can be run from this volume. Once analysis has been completed, however, data you wish to retain must be moved elsewhere; the retention policy will remove data from scratch storage after 90 days.


### Custom Storage
<table style="margin-bottom: 0; width: 600px;" align="center">
<tbody>
<tr>
<th style="width: 200px;">Size limit</th>
<td>1 Tb+</td>
</tr>
<tr>
<th>Availability</th>
<td>A per group basis, depending on needs and funding</td>
</tr>
<tr>
<th>Backup</th>
<td>A per group basis, depending on needs and funding</td>
</tr>
<tr>
<th>Retention policy</th>
<td>A per group basis, depending on needs and funding</td>
</tr>
<tr>
<th>Performance</th>
<td>A per group basis, depending on needs and funding</td>
</tr>
<tr>
<th>Cost</th>
<td>A per group basis, depending on needs and funding</td>
</tr>
</tbody>
</table>

In addition to the storage tiers listed above, Research Computing hosts a number of owned, custom storage systems. These are paid for by specific groups, once storage sizes/specifications are proposed by RC, and are housed and maintained by Research Computing, and integrated into our infrastructure like any other system. These system range from dedicated group storage w/ backups, to scratch-style systems, to dedicated parallel systems. These are many times designed for very specific application/instrument requirements, or when the cost model of our shared storage no longer makes sense for the amount of storage desired. Please contact [RCHelp](rchelp>) to get details.

### Cost

Basic fixed price backed-up storage with backup is $900/TB per 3 years. For quotes on custom storage systems please contact [RCHelp](rchelp>).

Billing requirements: A 33 digit billing code, unit details and description of the the storage (for the invoice line item) from the PI or their faculty/financial admin.

### Terminology

#### Snapshots/Checkpoints
Snapshots/Checkpoints are point-in-time copies of files/directories as they were at the time of the snapshot. *These are stored on the same storage system as the primary data, and would not be useful in the event of system failure for recovery.* They are however, excellent at protecting from accidental deletion, bad edits, and a quick, general safety net.

#### Backups
Backups, unlike snapshots/checkpoints are full copies of the primary data, which resides on another storage system in another physical location (Data center). This provides protection from system failures and physical issues. These backups are done in an incremental manner (only changed data is copied, with 1 full copy of the primary data and a number of incremental backups providing a bit of history, without storing the data multiple times for unchanged files). Backups are typically done daily, keeping **2 weeks** worth of daily history, unless otherwise requested or stated. *Again, these backups are intended for recovering from catastrophic failures, and not recovering from accidental file deletions.*

#### Replication
Replication refers to storage systems which are real-time replicated to a paired system, typically in another physical location. There is no history here, and a file deleted is deleted in both storage locations. Replication provides protection from system/data center/network failures, without interrupting access to the storage.

#### CIFS/SMB
CIFS/SMB refers to the now standard way of accessing RC storage resources from systems outside our infrastructure, such as workstations/laptops etc. Also known as Windows Drive Mapping, or simple connecting to a shared drive. This is an authenticated method of connecting available on Windows, OSX and Linux systems. This is typically available from on campus (non-wifi) as well as VPN (wifi and off campus access). Please see [this help document](access-and-login.html#mounting-odyssey-storage-like-home-directories-and-lab-shares-on-your-desktop) for step-by-step instructions.

