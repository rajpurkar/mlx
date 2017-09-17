---
title: model-interpretability
tags:
---
We look at [Deep Inside Convolutional Networks: Visualising Image Classification Models and Saliency Maps](https://arxiv.org/pdf/1312.6034.pdf)

This paper looks at the visualization of deep learning based image classification models. There are two ideas for visualizing the workings of the neural network. Both of them require computing of the gradient of the output with respect to the input image.

**Class Model Visualization**: The task here is to generate an image which will best represent a category. *Think: what's the image that looks most like a spaceship to the neural network?*. We're going to find the image $I$ which maximizes the score $S_c(I)$ the network assigns to category $c$.

$$\underset{I}{argmax}\space S_c(I)$$

We can start off with some image $I$, compute the gradient with respect to $I$ using back-propagation, and then use gradient ascent to find a better $I$, repeating the process until we find a locally optimal $I$. This is very similar to the optimization process for training a neural network, but instead of optimizing the weights, we're optimizing the image, but keeping the weights fixed.

{% asset_img class_model_vis.png Class model visualizations for 3 different classes. Source: https://arxiv.org/pdf/1312.6034.pdf.%}

**Class Saliency in an Image**: The goal here is to find the pixels of an image which contribute most towards a particular classification. *Think: what pixels in this image are most important for the neural network to classify it as an image of a spaceship.* We're going to take the derivative of the class score $S$ with respect to the input image space $I$, and evaluate at our image $I_0$.

$$\frac{\partial S}{\partial I}\Biggr\rvert_{I_0}$$

The above derivative gives us a scalar value for each of the pixels in the image. We can take the magnitude (absolute value) of these values and then normalize them to get a class saliency map over the image.

{% asset_img image_specific_saliency_map.png Image-specific Saliency Map shows pixels that are most important for the image being classified as a dog. Source: https://arxiv.org/pdf/1312.6034.pdf.%}

Notes:
- What is $S_c$?
used the (unnormalised) class scores Sc, rather than the class posteriors, returned by the soft-max layer: Pc = Pexp Sc c exp Sc. The reason is that the maximisation of the class posterior can be achieved by minimising the scores of other classes.
- Localization for free:














