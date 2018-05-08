import {MarkdownContentParser} from './markdowncontentparser';

steem.api.setOptions({ url: 'https://api.steemit.com' });

export function createPostHtml (author: string, permlink: string, callback: (error :string|null, result :BlogEntry) => void) : void
{
	steem.api.getContent(author, permlink, function(err, post)
	{
		let result = {} as BlogEntry;

		if(!err && post.body !== "")
		{
			let markdownContentParser = new MarkdownContentParser();
			markdownContentParser.Parse(post.body);

			result.author = post.author;
			result.body = markdownContentParser.body;
			result.created = new Date(post.created + '.000Z');
			result.title = post.title;
			result.url = post.url;

			callback(null, result);
		}
		else
		{
			callback(err, result);
		}
	});
}

export function GetBlogArticles (author: string, limit: number, callback: (error :string|null, result :Array<BlogEntry>) => void) : void
{
	steem.api.getDiscussionsByBlog({tag: 'steemmakers', limit: 20}, function(err, posts) 
	{
		let result: BlogEntry[] = Array();
		if(!err)
		{
			for (var i = 0; i < posts.length; i++) 
			{
				let newEntry = {} as BlogEntry;
				let markdownContentParser = new MarkdownContentParser();
				markdownContentParser.Parse(posts[i].body);
	
				newEntry.author = posts[i].author;
				newEntry.body = markdownContentParser.body;
				newEntry.created = new Date(posts[i].created + '.000Z');
				newEntry.title = posts[i].title;
				newEntry.url = posts[i].url;
				result.push(newEntry);
			}
			callback(null, result);
		}
		else
		{
			callback(err, result);
		}
	});
}