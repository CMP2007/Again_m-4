const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs)=>{
    const totalLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
    return totalLikes
}

const favoriteBlog = (blogs)=>{
  if (blogs.length == 0) {
    return null
  }
  const newArray = blogs.map(blog => {
    return {
      title: blog.title,
      author: blog.author,
      likes: blog.likes
    } 
  })
  const blogWinner = newArray.reduce((max, actual)=>{
    return (actual.likes > max.likes) ?actual :max
  })  
  return blogWinner
}


module.exports = {
  dummy, 
  totalLikes,
  favoriteBlog
}