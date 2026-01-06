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

const mostBlogs = (blogs)=>{

  if (blogs.length ==0) {
    return  null
  }
  const most = blogs.map(blog=>{   
    const filter = blogs.filter(f=> f.author === blog.author)
    return filter
  })

  const mostLength = most.map(blog=>blog.length)
  
  const maxMost = Math.max(...mostLength)
  
  const blogfind = most.find(blog=>blog.length===maxMost)
  const oneBlog = blogfind[0]

  const reducedBlog = {
    author: oneBlog.author,
    blogs: maxMost
  }
  return reducedBlog

}

const mostLikes = (blogs)=>{
  if (blogs.length ==0) {
    return  null
  }
  const count = blogs.reduce((nex, actual)=>{
    nex[actual.author] = (nex[actual.author] || 0) + actual.likes
    return nex
  },{})
  const moreLikes = Object.keys(count).reduce((nex, actual)=>
    count[nex] > count[actual]  ?nex :actual
  ,)
  const winner = {
    author: moreLikes,
    likes: count[moreLikes]
  }
  return winner
}


module.exports = {
  dummy, 
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}