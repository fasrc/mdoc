Title: Common Odyssey Pitfalls
Date: 2015-11-10
Category: slurm
Tags: Odyssey, Slurm
Summary: These are some of the common problems that people have when using Odyssey.

These are some of the common problems that people have when using Odyssey. We hope that these will not be a problem for you as well.

<table>
<tr>
<th>Problem</th><th>Symptom/Reason</th>
</tr>
<tr>
  <td>Throwing multiple cores at Python and R code</td>
  <td>Without special programming, code written for Python and R is single-threaded. That means give more cores in SLURM to your code will do nothing except waste resources. If you which to use multiple cores, you must explicitly write your code to use them, using modules such as 'multiprocessing' or packages like 'Rparallel' or 'RMPI'.</td>
</tr><tr>
<tr>
  <td>Jobs PENDing for &gt;48 hrs</td>
  <td>Asking for very large resource requests (cores & memory): adjust lower and try again. Or very low Fairshare score: contact us</td>
</tr><tr>
  <td>Quick run and FAIL...Not including -t parameter</td>
  <td>no -t means shortest possible in all partitions == 10 min</td>
</tr>
  <td>Asking for multiple cores but forgetting to specify one node</td>
  <td>-n 4 -N 1 is very different from -n 4</td>
</tr>
<tr>
  <td>Not specifying enough cores</td>
  <td>prog1 | prog2 | prog3 &gt; outfile should run with 3 cores!</td>
</tr>
<tr>
  <td>Causing massive disk I/O on home folders/lab disk shares</td>
  <td>Your work & others on the same filesystem slows to a crawl: simple commands like <code>ls</code> take forever</td>
</tr>
<tr>
  <td>Hundreds/thousands of jobs access one common file</td>
  <td>Your work & others on the same filesystem slows to a crawl. Make copies of file and have jobs access one of the group</td>
</tr>
<tr>
  <td>Don’t pack more than 5K files in one directory</td>
  <td>I/O for your jobs will slow to a crawl</td>
</tr>
<tr>
  <td>Bundle your work into ~10 min jobs</td>
  <td>Kinder for us, kinder for you, kinder for Odyssey</td>
</tr>
<tr>
  <td>Please understand your software -- look at the options!</td>
  <td>Who knows what could happen?? You wouldn't use an instrument without reading the instructions, would you?</td>
</tr>
<tr>
  <td>Trying to sudo when installing software</td>
  <td>Please don’t -- we admin the boxes for you.</td>
</tr>
</table>
