import React from "react";
import ReviewsSection from "./ReviewsSection";
import SocialSection from "./SocialSection";

const ReviewsAndSocial: React.FC = () => (
  <section aria-label="Reviews and Social Media Overview" className="space-y-6">
    <ReviewsSection />
    <SocialSection />
  </section>
);

export default ReviewsAndSocial;
