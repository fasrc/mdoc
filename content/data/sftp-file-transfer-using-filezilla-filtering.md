Title: SFTP file transfer using Filezilla - Filtering
Date: 2014-06-23
Category: data
Tags: Odyssey
Summary: Transferring data to and from research computing facilities using Filezilla filtering.

This page describes the use of Filezilla filters. For more general information see the [main Filezilla page](sftp-file-transfer-using-filezilla-macwindowslinux.html).

There may be times when you wish to filter the file listing in the local or remote pane. If you need to do this often, you may want to set up a filter. Unlike the search feature (binoculars icon), filters modify what is shown in the _Remote Site:_ or _Local Site:_ pane. If you simply need to see files grouped together by name, date modified, filesize, etc. you do not need to use a filter, you can sort on those criteria using the attributes at the top of the file listing. Example: To sort based on date modified, click _Last Modified_. Click it again to reverse the sort (ascending/descending). 

<figure>
	<a class="img" href="/docs/images/filezilla_filter_1.png">
    		<img class="img-responsive" src="/docs/images/filezilla_filter_1.png"></img>
	</a>
    <figcaption></figcaption>
</figure>

**![Warning-icon](/docs/images/Warning-icon.png)A NOTE ABOUT FILTERS**: One of the pitfalls to using filters is forgetting they are enabled. Keep in mind that if you open up a session and files seem to be missing or oddly sorted, you _may have left a filter engaged_. Simply open Filename Filters and disable the filter to return to normal.

### CREATING/EDITING A FILTER IN FILEZILLA

To create a filter, select **View** then **Filename Filters** from the main menu (or click its icon, 4th from the left of the 'Search' binoculars) to open the _Directory Listing Filters_ window. Note that filter rules can be applied to either pane (local or remote). Click _Edit filter rules_ to create a new filter or edit an existing one. 

<figure>
	<a class="img" href="/docs/images/filezilla_filter_2.png">
    		<img class="img-responsive" src="/docs/images/filezilla_filter_2.png"></img>
	</a>
    <figcaption></figcaption>
</figure>

Click _New_ to add a new filter rule (or select an existing one if you wish to edit). Give your new rule a name that will make sense to you later. 

<figure>
	<a class="img" href="/docs/images/filezilla_filter_3.png">
    		<img class="img-responsive" src="/docs/images/filezilla_filter_3.png"></img>
	</a>
    <figcaption></figcaption>
</figure>

Set the criteria for your filter. You can add multiple conditions. In the example shown, only files and folders which begin with 'Resource' will be shown. I've also chosen to make the filter case-sensitive. **CAUTION**: If you plan to change directories/folders with a filter enabled, you will likely want to _not_ check the Directories box so that you can still see the directory structure. Otherwise, they may also be filtered out and you'll have to turn the filter off in order to change directories. 

<figure>
	<a class="img" href="/docs/images/filezilla_filter_4.png">
    		<img class="img-responsive" src="/docs/images/filezilla_filter_4.png"></img>
	</a>
    <figcaption></figcaption>
</figure>

Click OK to save the filter. You can now enable this new filter rule from the _Directory listing filters_ window. Simply tick its check box (on whichever side you wish to apply it) and click OK to engage the filter. 

<figure>
	<a class="img" href="/docs/images/filezilla_filter_5.png">
    		<img class="img-responsive" src="/docs/images/filezilla_filter_5.png"></img>
	</a>
    <figcaption></figcaption>
</figure>

![Warning-icon](https://rc.fas.harvard.edu/wp-content/uploads/2014/09/Warning-icon.png)**CAUTION**: It's easy to forget you have a filter engaged. If you create or use filter rules in Filezilla, then you should first check to see if any are enabled if a directory/file listing does not look right or you don't see files you expected to see.