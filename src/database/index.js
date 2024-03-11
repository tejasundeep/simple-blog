const files = require.context("./posts/", false, /\.json$/);
export default files
    .keys()
    .map((filename, index) => {
        const {
            id,
            title,
            image,
            date,
            category,
            tags,
            metatitle,
            metadesc,
            content,
        } = files(filename);
        return {
            id,
            title,
            image,
            date,
            category,
            tags,
            metatitle,
            metadesc,
            content: content.replace(
                /<h2/g,
                () => `<h2 class="post_heading_${index + 1}"`
            ),
        };
    })
    .sort((a, b) => b.id - a.id);
