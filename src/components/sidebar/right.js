import SocialWidget from "@/components/widgets/social";
import PostTags from "@/components/widgets/tags";
import RelatedPosts from "@/components/widgets/related";

const RightSideBar = ({ title, category }) => (
    <>
        <SocialWidget />
        <RelatedPosts category={category} />
        <PostTags title={title} />
    </>
);

export default RightSideBar;
