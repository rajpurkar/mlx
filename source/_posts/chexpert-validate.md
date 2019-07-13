---
title: Validating the CheXpert model on your own data in an hour
tags:
  - AI
  - medicine
  - external validation
subtitle: A Walkthrough For External Validation of Chest X-Ray Interpretation
author: 'Pranav Rajpurkar, Jeremy Irvin, Matt Lungren'
date: 2019-07-13 22:52:44
---


In this post, we provide a walkthrough of how you can run a chest x-ray interpretation model on your own data without writing any code, in just an hour!

### CXR Interpretation: Our Journey and Next Frontier
In the [Stanford Machine Learning Group](https://stanfordmlgroup.github.io) and the [AIMI center](http://aimi.stanford.edu), chest x-ray interpretation, a *bread and butter* problem for radiologists with vital public health implications, has been one of our primary focus areas.

In late 2017, using the [NIH’s Chest X-ray14 dataset](https://arxiv.org/abs/1705.02315) released by Xiaosong Wang et al., we built an algorithm ([CheXNet](https://arxiv.org/abs/1711.05225)) to detect pneumonia and showed that its performance was comparable to radiologists; [Luke Oakden-Rayner](https://lukeoakdenrayner.wordpress.com/2018/01/24/chexnet-an-in-depth-review/), [Stephen Borstelmann](https://n2value.com/blog/chexnet-a-brief-evaluation/) and others reviewed some of the strengths and weaknesses of our setup. In late 2018, we [published work](https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.1002686) showing that an extension of CheXNet ([CheXNeXt](https://stanfordmlgroup.github.io/projects/chexnext/)) could detect upto 10 pathologies at the level of 9 radiologists; at the same time, work by [John Zech at al.](https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.1002683) showed that a reimplementation of CheXNet did generalized to another institution’s data. In early 2019, we built and released [CheXpert](https://arxiv.org/abs/1901.07031), a large dataset of chest x-rays and competition for chest x-ray interpretation (co-released with MIT's release of [MIMIC-CXR](https://arxiv.org/abs/1901.07042) by Alistair Johnson et al., and reported a similar finding of performing comparably to radiologists on some pathologies. Over the past few months, development of chest x-ray interpretation algorithms have been accelerating, with now over 32 models submitted to the [CheXpert competition](https://stanfordmlgroup.github.io/competitions/chexpert/).

Since we published our findings, there have been several groups attempting to reproduce our algorithms ([1](https://github.com/zoogzog/chexnet), [2](https://github.com/brucechou1983/CheXNet-Keras), [3](https://github.com/arnoweng/CheXNet), [4](https://medium.com/@jrzech/reproducing-chexnet-with-pytorch-695ff9c3bf66)), and validate them on their own datasets. This is an encouraging signal -- before chest x-ray interpretation algorithms can impact clinical care, it is important that they be validated on data from other institutions, countries, and patient populations. Validation provides valuable information about the generalizability of the model to different settings, and informs settings in which further development is required for safe and effective use of algorithms.

### Making it Easy for Everyone to Validate Our Models
We set ourselves the **challenge of making it as easy as possible for everyone to use our chest x-ray algorithm for validation** on external data. Getting an algorithm on a new dataset is traditionally a challenging and tedious task, usually requiring computer science expertise, and patience to work through a lot of installation setup. Computer science practitioners are well aware that even when the code is open-sourced, it takes a lot of trial and error to work through installation if the dependencies are not cross-platform, or worse, if they haven’t been specified. Deep learning practice can be even more challenging: local installation is hard because the models may not even fit in local memory. In the remainder of this post, we provide a walkthrough of how you can run a chest x-ray interpretation model on your own data without writing any code, in just an hour!

## Walkthrough of Validating CheXpert model on your own data
*For this walkthrough, you don't need any coding experience. You also don't need any data: we'll provide you data example we use for this walkthrough. We had three friends go through this walkthrough; it took them 1.5 hours on average.*

### How to Set Up Your Data: Formatting and Organization
*If you're coming in with your own data, this section will help you transform it to the right format. If you don’t have a dataset right now, [download the data we've generated](https://drive.google.com/drive/folders/1WVKMv9NWwxg69XZcTtjJgdl9IdKkEJ8T?usp=sharing), and you can skip along to the [next section](#Running-the-CheXpert-model-on-your-data).*

In this section, we're going to get our data into a format that the algorithm expects. There will be three things we'll need: a folder containing x-ray images, a file containing a list of images to be passed into the algorithm, and a file containing information about the ground truth for each of the studies.

For the purposes of this walkthrough, we've compiled a dataset of google images of chest x-rays. We constructed this dataset of 96 images by googling for 5 pathologies (Cardiomegaly, Edema, Consolidation, Atelectasis, and Pleural Effusion) on Google Image search and also the Normal category. The first 16 image results judged to not have any annotations on them were chosen to be included. There was no verification of the ground truth performed; this is just a fun dataset that we can share for this tutorial.

<br>

#### Image Directory
The first thing we'll need is a folder containing all the images in the dataset. We'll be organizing these images in a very specific format: we recommend that you follow the details closely.

{% asset_img dataset_folder.png Example image directory %}

The folder should be structured in the following way:
1. The folder should be named 'dataset'.
2. Inside 'dataset', there should be folders for every patient (example: patient001).
3. Insider every patient folder, there should be a study folder. Each study can have a different ground truth. (example: study1) *In our example, we only have one study per patient, but there can be multiple*
4. Inside every study folder, there should be images (JPG format, ending in .jpg). *In our example, we have one image per study, but you might have a frontal and a lateral view.*

Finally, this 'dataset' folder should be zipped into a file called 'dataset.zip'. We will use this zip file shortly.

<br>

#### Image Path List
The second thing we'll need is a file containing the paths of all images we're running through the algorithm. This file will be in a CSV (spreadsheet) format, which can be generated by Microsoft Excel's 'save as' function.

{% asset_img image_paths.png Example image paths file %}

The CSV file should have the following structure:
1. The file should contain only one column, with the top row as ‘Path’, and a list of image paths in subsequent rows.
2. The image paths must have the format dataset/{patient_name}/{study_name}/{image_name}.jpg 

This CSV should be saved with the name 'image_paths.csv'.

<br>

#### Ground Truth
The third and final thing we'll need is a file specifying the ground truth for each study. This file will also be in a CSV (spreadsheet) format.

{% asset_img ground_truths.png Example ground truths file %}

This CSV file should have the following structure:
1. Have 6 columns in total, with the first row containing ‘Study’, followed by the 5 pathologies the algorithm produces outputs for: Cardiomegaly, Edema, Consolidation, Atelectasis, and Pleural Effusion. *Our algorithm does not currently support more than these pathologies.*
3. The paths (in the first column) should have the format 'dataset/{patient_name}/{study_name}'. *Note that these are paths to the studies, not to the images, different from image_paths.csv, which specifies the filenames, while this file specifies the studies. Remember that a study can contain multiple images, but only has one ground truth.*
4. The values for the ground truth should be 1 or 0, denoting the presence or absence of the pathology.

This CSV file should be saved with the name 'ground_truths.csv'.

<br>

#### Recommendations For Setting Up Your Data
*Ground Truth: Try to set as strong a ground truth as possible on your data. In our previous setups, we've used the majority vote of multiple radiologists as the ground truth; others use CT confirmations when possible. A strong ground truth sets the best possible assessment of the model on the data.*
*Sample size: Aim for as large a validation set as possible. We've used the heuristic that the prevalence for each of the pathologies be at least 30 studies.*
*Images:  We recommend that the input images be close to square, and grayscale (not color), and that images be smaller than 500x500, since the model will downsample them to 320x320 during training.*


<br>

### Running the CheXpert model on your data
We will now run through how you can run the CheXpert model we've pre-trained on Stanford data on the dataset you've prepared. *If you're using our example data, now's a good time to [download it if you haven't already](https://drive.google.com/drive/folders/1WVKMv9NWwxg69XZcTtjJgdl9IdKkEJ8T?usp=sharing).* At the end of this section, you'll be able to see the Area Under the Curve Metric (AUC) of the model for the 5 tasks on your data.

<br>
{% asset_img final.png The final output we'll work towards %}
<br>

#### Creating An Account on Codalab.
We'll be using the Codalab platform for running the model on your data. CodaLab is an online platform for collaborative and reproducible computational research, developed by Percy Liang at Stanford. The platform has an interface for running commands, using which you will upload your data and run the Chexpert model.

First, we'll create an account on Codalab:
1. Go to http://worksheets.codalab.org and click "Sign Up" in the top-right corner.
2. Fill out the subsequent form.
3. A verification email will be sent to the email address you used to sign up. When you open it, there will be a link to follow in order to verify your account.
4. After verifying your account, sign in again.

<br>

#### Uploading the data on Codalab
We will create a worksheet to organize and setup the running of the model on our data, beginning with uploading the data.

Now, click on 'New Worksheet' on the right sidebar.

<br>
{% asset_img new_worksheet.png New Worksheet %}
<br>

It should prompt you to enter a name for the worksheet.
<br>
{% asset_img new_worksheet_2.png New Worksheet Name %}
<br>

Click on the 'Upload' button in the sidebar:
<br>
{% asset_img upload.png Upload %}
<br>

Upload dataset.zip first. In a few seconds, you should see a line appended to the worksheet (refresh the page if you don't). Then upload image_paths.csv, and then ground_truths.csv, one by one. All the data should be uploaded at that point.
<br>
{% asset_img upload2.png All Files Are Uploaded %}
<br>

#### Running the CheXPert Model on the Uploaded Data
Now that the data is in place, we're going to run the CheXPert model on it.

We're going to first click on the 'Click here to enter commands' pane at the top of the webpage.
<br>
{% asset_img command_line.png Click the Command Pane %}
<br>

Once we have clicked on the commands pane, the pane will expand. Copy the following command into the pane, and press enter:
{% codeblock %}
macro chexpert-validate/validate dataset image_paths.csv ground_truths.csv
{% endcodeblock %}

<br>
{% asset_img command1.png Enter the Command %}
<br>

In a second or two, you should see some output from the interface (after you've pressed enter).
Then click outside the pane (shown in figure below).

Congratulations, you've already kicked off the run of the model on your data in just one line. 

*There's a lot of magic behind the scenes that Codalab performs to make this possible in just one line. Behind the scenes, the CheXpert model is being downloaded onto a remote machine with a GPU instance, on which a Docker container will be set up. This Docker container loads all the required dependencies required to run the exact environment that the model needs to run.*

<br>
{% asset_img command2.png See the outputs and click outside %}
<br>

You should be able to see a few files appended to your worksheet. 'New run' is the live running of the model on your dataset. 'New predictions' is the file that will be populated with the predictions of the model on each of the studies in the dataset when the model running is complete.

<br>
{% asset_img check1.png Verify that a few files are appended to your worksheet%}
<br>

Click on the 'New run' row of the table. The sidebar should change, and now display information about the status of the model's run on the data. We're going to give special attention to the 'state' of the run, which will start off with 'preparing', while the model is being downloaded on to a remote machine. This can take a few minutes (10 minutes for us), so come back to this after a bit.


<br>
{% asset_img check2.png Check the status %}
<br>

Soon, the status of the run should update to 'running'. Now the model has been loaded on to a machine, and predictions are being made on your dataset. This takes 10 minutes for us using the example dataset, and will take longer on a larger dataset. *Note that the Chexpert model is not one model, but a collection of 30 specialist models, which must each be sequentially run on the data.*

<br>
{% asset_img check3.png Check the status again %}
<br>

Once the model has finished running, the status of the run will update to 'ready'. In a few seconds, the table should auto-populate (refresh the page if it doesn't) with the AUC scores of the model on the data across the various tasks (using the ground truth you've supplied).

*If you see an error, please go back to the previous steps, and make sure that you haven't missed any instructions.*

*If you’re an advanced user looking for confidence intervals on the AUC or further statistical analysis, advanced users can download the prediction file by clicking on the 'new_predictions' row, and then clicking download on the sidebar.*

<br>
{% asset_img ready.png Running is completed %}
<br>

And that’s it! In just over an hour, we’ve been able to run the CheXpert model on your own data!

<br>

# Join us in a worldwide effort
If you’ve followed our tutorial and successfully validated CheXpert model on your own institution’s data (or data that’s not from our google image example), we’d love to know! Please let us know how CheXpert did on your population! We encourage you to publish, and to also join our efforts in compiling the performances of the model on data worldwide. Email us at:
{% codeblock %}
pranavsr@stanford.edu, jirvin16@stanford.edu, mlungren@stanford.edu 
{% endcodeblock %}

<br>
#### Acknowledgements
Thanks to our colleagues Nguyet Minh Phu and Mark Sabini for collecting and labeling the google images dataset we use in our example.
