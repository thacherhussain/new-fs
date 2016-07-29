const fs = require('fs')
const pug = require('pug');
const path = require('path')

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

function normalize(path, indentationLevel) {
  return '../'.repeat(indentationLevel) + path
}

function linkify(data, indentationLevel) {
  let result = []
  let week

  data.forEach(function (day, i) {
    if (i % 5 === 0) { // start a new week every monday, every 5th day
      week = []
      result.push(week)
    }
    week.push(day)

    day.name = days[i % 5]

    if (day.warmup && day.warmup.path) {
      day.warmup.url = normalize(day.warmup.path, indentationLevel)
    }
    day.activities = day.activities || []

    day.activities.forEach(function (activity) {
      if (activity.article && activity.article.path) {
        activity.article.url = normalize(activity.article.path, indentationLevel)
      }
      if (activity.exercise && activity.exercise.path) {
        activity.exercise.url = normalize(activity.exercise.path, indentationLevel)
      }
      if (activity.stretch && activity.stretch.path) {
        activity.stretch.url = normalize(activity.stretch.path, indentationLevel)
      }
    })

    day.firstActivity = day.activities[0]
    day.otherActivities = day.activities.slice(1)
  })

  return result
}

const templatePath = path.format({root: __dirname, base: '/table.pug'})
let template = pug.compileFile(templatePath, {pretty: true});

exports.renderTo = function (data, path, indentationLevel) {
  let weeks = linkify(data, indentationLevel)

  let tables = weeks.map(week => template({data: week}))
  let segments = []
  tables.forEach(function (table, i) {
    segments.push(`Week ${i + 1}`)
    segments.push(table)
    segments.push('')
    segments.push('')
  })
  let html = segments.join('\n').trim()

  writeToDisk(path, html)
}

exports.renderToWeek = function (data, path, indentationLevel, weekNumber) {
  let weeks = linkify(data, indentationLevel)
  let html = template({data: weeks[weekNumber]})
  writeToDisk(path, html)
}

function writeToDisk(path, html) {
  const file = fs.readFileSync(path, 'utf8')
  const lines = file.split("\n")
  const startLine = lines.indexOf('<!-- BEGIN SCHEDULE -->')
  const endLine = lines.indexOf('<!-- END SCHEDULE -->')

  lines.splice(startLine + 1, endLine - startLine - 1)
  lines.splice(startLine + 1, 0, html)

  console.log(lines.join("\n"));
  fs.writeFileSync(path, lines.join('\n'))
}
