package main;

import (
"html/template"
"gopkg.in/mgo.v2"
"gopkg.in/mgo.v2/bson"
"log"
"sort"
"net/http")

type RatingsPage struct {
    Prefix string
    TemplateName string
    MongoSession *mgo.Session
}

type AcceptPage struct {
    Prefix string
    MongoSession *mgo.Session
}

type RatingsPageContext struct {
    Users []User
    Tasks []Task
}

type Task struct {
    Name string
    Index uint64
}

type User struct {
    Nickname string
    SolvedTasks map[string]float64
}

type Flag struct {
    UniqueString string
    Worth float64
    TaskName string
}

type Users []User
type Tasks []Task
type Flags []Flag

func (user User) TotalScore() (score float64) {
    for _, value := range user.SolvedTasks {
        score += value
    }
    return
}

func (users Users) Len() int { return len(users) }
func (users Users) Swap(i, j int) {  users[i], users[j] = users[j], users[i] }
func (users Users) Less(i, j int) bool {  return users[i].TotalScore() > users[j].TotalScore() }

func (tasks Tasks) Len() int { return len(tasks) }
func (tasks Tasks) Swap(i, j int) {  tasks[i], tasks[j] = tasks[j], tasks[i] }
func (tasks Tasks) Less(i, j int) bool {  return tasks[i].Index < tasks[j].Index }

func GetUsers(session *mgo.Session) (users Users, err error) {
    userCollection := session.DB("re14").C("users")
    iter := userCollection.Find(nil).Iter()
    err = iter.All(&users)
    return
}

func GetTasks(session *mgo.Session) (tasks Tasks, err error) {
    tasksCollection := session.DB("re14").C("tasks")
    iter := tasksCollection.Find(nil).Iter()
    err = iter.All(&tasks)
    return
}

func GetUser(session *mgo.Session, nickname string) (user User, err error) {
    userCollection := session.DB("re14").C("users")
    err = userCollection.Find(bson.M{"nickname" : nickname}).One(&user)
    if err != nil {
        user = User{Nickname : nickname, SolvedTasks : make(map[string]float64)}
        userCollection.Insert(&user)
    }
    return
}

func SaveUser(session *mgo.Session, user User) {
    userCollection := session.DB("re14").C("users")
    userCollection.Update(bson.M{"nickname" : user.Nickname}, user)
}

func (page *RatingsPage) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    fMap := template.FuncMap{"even": func(w int) int { return w % 2 } }
    t, _ := template.New("ratings").Funcs(fMap).ParseFiles(page.TemplateName)

    users, _ := GetUsers(page.MongoSession)
    tasks, _ := GetTasks(page.MongoSession)
    sort.Sort(users)
    ratingsPageContext := RatingsPageContext{Users : users, Tasks : tasks}
    t.Execute(w, ratingsPageContext)
}

func FindFlag(session *mgo.Session, uniqueString string) (flag Flag, err error) {
    flagCollection := session.DB("re14").C("flags")
    err = flagCollection.Find(bson.M{"uniquestring" : uniqueString}).One(&flag)
    return
}

func AddSolvedTask(session *mgo.Session, nickname string, flag Flag) {
    user, _ := GetUser(session, nickname)
    user.SolvedTasks[flag.TaskName] = flag.Worth
    SaveUser(session, user)
}

func (page *AcceptPage) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    nickname, uniqueString := r.PostFormValue("nickname"), r.PostFormValue("flag")
    if nickname != "" && uniqueString != "" {
        flag, err := FindFlag(page.MongoSession, uniqueString)
        if err == nil {
            AddSolvedTask(page.MongoSession, nickname, flag)
        }
    }
    http.Redirect(w, r, "/re/14/test", 301)
}

const (
    MongoHost = "127.0.0.1"
    BindAddress = "127.0.0.1:8081"
)

func main() {
    session, err := mgo.Dial(MongoHost)
    if err != nil {
        panic(err)
    }

    ratingsPage := RatingsPage{Prefix : "/re/14/test", TemplateName : "views/ratings", MongoSession : session}
    acceptPage := AcceptPage{Prefix : "/re/14/accept", MongoSession : session}

    http.Handle(ratingsPage.Prefix, &ratingsPage)
    http.Handle(acceptPage.Prefix, &acceptPage)

    log.Print("Start on ", BindAddress)
    http.ListenAndServe(BindAddress, nil)
}
