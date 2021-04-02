+++
title = "How I made it"
date = "2021-03-31"
description = "How I built this site using hugo and github pages."
tags = []
+++
I made a site and published it. The proof is that you're reading this. I've been meaning to do this for a while, and it turned out to be not too hard. Here's what I did: 

1. I chose Hugo as a static site generator, because that's what [blogdown](https://github.com/rstudio/blogdown) uses, which I might decide to use some day. If I don't, I might change to jekyll, since it has some nice integrations with github pages. 

1. Choosing a theme took the most time. I chose this super simple [bearblog](https://themes.gohugo.io/hugo-bearblog/) theme because it was easy to get started with, and I figured it would probably be easy to customize or port my stuff to a new theme if I decide to do so.

1. Using [GoDaddy](https://au.godaddy.com/), I purchased helenthehuman.com. I'm working on my personal branding, and figured helenthehuman is a good option becuase I want to distinguish myself from those other Helens out there. I used GoDaddy because I had heard of it before and didn't know of any other DNS providers out there...

1. Now that I had made all the hard decisions, I set up my project, using the [instructions from Hugo](https://gohugo.io/getting-started/quick-start/), and pushed it to a new repo on github. I set it up as a project site, because you only get one user site, and I'm afraid of commitment.

1. It seemed like the path of least resistance was to build my site myself and commit the changes. Github by default only allows you to publish a site from the `docs` subfolder (there's probably a way around that, but I didn't bother to figure it out). So, I added this line in my `config.toml` so that it builds the site into `docs` (as opposed to the default `public`): 

    ```
    publishDir = "docs"
    ```
1. The final step was to get github pages running and point my domain to wherever github was serving it. [These instructions](https://jinnabalu.medium.com/godaddy-domain-with-github-pages-62aed906d4ef) worked great.

You can see all the source code at https://github.com/helenmiller16/helenthehuman. 

## Coming Soon...
What's next in the world of setting up my personal website via github pages? Here are some ideas...   
* Use github actions to build the site instead of pre-building it
* Use Jekyll instead, and take advantage of the nice integrations in github
* Make it prettier by including some nice styling and photos etc. 
* Set it up as an R project with blogdown so I can write some cools stories about data with R code and plots etc. 
* Create some exciting content and get famous