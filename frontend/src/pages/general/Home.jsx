import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'

const Home = () => {
    const [videos, setVideos] = useState([])
    // Autoplay behavior is handled inside ReelFeed

    const VITE_API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        axios.get(`${VITE_API_URL}/api/food`, { withCredentials: true })
            .then(response => {

                console.log(response.data);

                setVideos(response.data.foodItems)
            })
            .catch(() => { /* noop: optionally handle error */ })
    }, [])

    // Using local refs within ReelFeed; keeping map here for dependency parity if needed

    async function likeVideo(item) {
        // Optimistic update
        const wasLiked = item.isLiked;
        setVideos((prev) => prev.map((v) =>
            v._id === item._id
                ? { ...v, isLiked: !wasLiked, likeCount: v.likeCount + (wasLiked ? -1 : 1) }
                : v
        ));

        try {
            const response = await axios.post(`${VITE_API_URL}/api/food/like`, { foodId: item._id }, { withCredentials: true });

            // Revert if backend response contradicts optimistic update (optional, but good practice)
            // For now, we trust the optimistic update unless error
        } catch (error) {
            console.error("Error liking video:", error);
            // Revert on error
            setVideos((prev) => prev.map((v) =>
                v._id === item._id
                    ? { ...v, isLiked: wasLiked, likeCount: v.likeCount + (wasLiked ? 1 : -1) }
                    : v
            ));
        }
    }

    async function saveVideo(item) {
        // Optimistic update
        const wasSaved = item.isSaved;
        setVideos((prev) => prev.map((v) =>
            v._id === item._id
                ? { ...v, isSaved: !wasSaved, savesCount: v.savesCount + (wasSaved ? -1 : 1) }
                : v
        ));

        try {
            const response = await axios.post(`${VITE_API_URL}/api/food/save`, { foodId: item._id }, { withCredentials: true });
        } catch (error) {
            console.error("Error saving video:", error);
            // Revert on error
            setVideos((prev) => prev.map((v) =>
                v._id === item._id
                    ? { ...v, isSaved: wasSaved, savesCount: v.savesCount + (wasSaved ? 1 : -1) }
                    : v
            ));
        }
    }

    return (
        <ReelFeed
            items={videos}
            onLike={likeVideo}
            onSave={saveVideo}
            emptyMessage="No videos available."
        />
    )
}

export default Home