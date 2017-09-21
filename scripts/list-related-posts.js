// scripts/list-related-posts.js
'use strict';
const _ = require('lodash');

function listRelatedPosts(options) {
  options = _.merge({
    maxCount: 5,
    orderBy: 'updated'
  }, options || {});

  let tags = new Set();
  let posts = this.site.posts
    .toArray()
    .filter(p => p.slug !== this.page.slug); // filter current post

  // fetch tags of current post
  this.page.tags.toArray().forEach(t => tags.add(t.name));

  // rate tags
  posts.forEach(post => {
    post.__relatedWeight = 0;
    post.tags.toArray().forEach(postTag => {
      if(tags.has(postTag.name)) post.__relatedWeight++;
    });
  });

  // order the result
  posts = _.orderBy(posts, ['__relatedWeight', options.orderBy], ['desc', 'desc']);

  // respect maxCount
  posts = posts.slice(0, options.maxCount);

  return posts;
}


hexo.extend.helper.register('list_related_posts', listRelatedPosts);
