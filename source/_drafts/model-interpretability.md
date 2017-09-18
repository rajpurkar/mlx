---
title: model-interpretability
tags:
---
We look at [Deep Inside Convolutional Networks: Visualising Image Classification Models and Saliency Maps](https://arxiv.org/pdf/1312.6034.pdf)

This paper looks at the visualization of deep learning based image classification models. There are two ideas for visualizing the workings of the neural network. Both of them require computing of the gradient of the output with respect to the input image.

**Class Model Visualization**: The task here is to generate an image which will best represent a category. *Think: what's the image that looks most like a spaceship to the neural network?*. We're going to find the image $I$ which maximizes the score $S_c(I)$ the network assigns to category $c$; mathematically: $\mathtt{argmax}\_I \space S_c(I)$.

*Note: the score $S_c(I)$ is the score that the neural network assigns to a class *before* the softmax, not the probability $P_c = \frac{e^{S_c}}{\sum_c e^{S_c}}$

We can start off with some image $I$, compute the gradient with respect to $I$ using back-propagation, and then use gradient ascent to find a better $I$, repeating the process until we find a locally optimal $I$. This is very similar to the optimization process for training a neural network, but instead of optimizing the weights, we're optimizing the image, keeping the weights fixed.

{% asset_img class_model_vis.png Class model visualizations for 3 different classes. Source: https://arxiv.org/pdf/1312.6034.pdf.%}

**Class Saliency in an Image**: The goal here is to find the pixels of an image which contribute most towards a particular classification. *Think: what pixels in this image are most important for the neural network to classify it as an image of a spaceship.* We're going to take the derivative of the class score $S$ with respect to the input image space $I$, and evaluate at our image $I\_0$; mathematically: $\frac{\partial S}{\partial I}\bigr\rvert\_{I\_0}$.

The above derivative gives us a scalar value for each of the pixels $w_{ij} $ in the image. We can take the magnitude of these values and then normalize them to get a class saliency map $M$ over the image.

$$ M\_{ij} = \frac{w\_{ij}}{\sum\_{ij} w\_{ij}} $$

{% asset_img image_specific_saliency_map.png Image-specific Saliency Map shows pixels that are most important for the image being classified as a dog. Source: https://arxiv.org/pdf/1312.6034.pdf.%}

*What's cool about this?* The image specific saliency map can be used for localizing an object of interest (*in the above example, we can see where the dog in the image is*), and segment it out with the help of a segmentation algorithm. Note that the classification model isn't trained with object locations; it's only given *(image, category)* pairs, but learns to localize: this is called *weakly-supervised object localization*.

The next paper we'll look at is [Learning Deep Features for Discriminative Localization](http://cnnlocalization.csail.mit.edu/Zhou_Learning_Deep_Features_CVPR_2016_paper.pdf).

This paper proposes another way to visualize class saliency in images. While the previous paper looks at using back-propagation of the output class score with respect to the input, this paper modifies the network architecture so that the forward propagation can perform both the classification and localization. 

