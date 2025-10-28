flowchart TD
  Start[Start] --> CheckAuth{User Logged In}
  CheckAuth -->|Yes| PhotoFeed[Photo Feed]
  CheckAuth -->|No| LoginPage[Login Signup Page]
  LoginPage -->|Submit Credentials| Authenticate[Authenticate User]
  Authenticate -->|Success| PhotoFeed
  Authenticate -->|Failure| LoginPage
  PhotoFeed -->|Select Photo| PhotoDetail[Photo Detail]
  PhotoFeed -->|Upload Photo| Upload[Upload Photo]
  PhotoDetail -->|Like Photo| Like[Like Photo]
  PhotoDetail -->|Add Comment| Comment[Add Comment]
  PhotoDetail -->|Back to Feed| PhotoFeed
  Upload --> UploadForm[Upload Form]
  UploadForm -->|Submit Photo| SavePhoto[Save Photo to Storage and DB]
  SavePhoto --> PhotoFeed
  PhotoFeed -->|Logout| Logout[Logout]
  Logout --> Start