window.onload = () => {
    var video = document.getElementById("video")

    let intervals = [[1, 5], [11, 13], [19, 21]]
    var curr = 0

    video.currentTime = intervals[0][0]
    video.addEventListener("timeupdate", () => {
        if (curr < intervals.length && video.currentTime >= intervals[curr][1]) {
            curr++
            if (curr < intervals.length) video.currentTime = intervals[curr][0]
            else video.pause()
        }
    })
}
