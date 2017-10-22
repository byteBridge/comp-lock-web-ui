# comp-lock-web-ui

> Platform to manage complock users and view help.

## Screenshots

### Signin page
![](/screenshots/login_screen.png)

Whenever the student wants to view his profile of the administrator wants to manage user accounts, the [computer manager](https://github.com/bytebridge/comp-lock) will open web browser with the signin page. Here the users (both admins and students) will sign in with their usual accounts.

### Online users
![](/screenshots/online_users.png)

The administrator can view which students are online, on which computers also the time the student signed in. In upcoming versions the administrator will be able to sign out users remotely if they are misusing the computers.

### User activities
![](/screenshots/user_graph.png)

The administrator can have a fine grained overviw of the sign in activities of the student. This information could be invaluable during investigations of coputer misuse to find out which student is responsible.

### The user can see their own graph too
![](/screenshots/user_own_graph.png)

This gives the student a high level overview of his/her account usage. Here the student can checkout if his/her account has been compromised by another student (e.g when it records that the user signed in on a day he/she did not use the computer) and take defensive action immediately.

## Interested?

This program was made for schools that want to be leaders in the technology space. You can request for a quote by emailing kgparadzayi@gmail.com. Looking forward working with you.

## License
This project is licenced under the [MIT License](/LICENSE.md) meaning that you have freedom to checkout the source code and modify it provided that the changes you will make are also open source and Licensed under the [MIT license](./LICENSE.md)
## Build Setup

This requires [CompLockApi](https://github.com/bytebridge/comp-lock-web-api) to be running.

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
