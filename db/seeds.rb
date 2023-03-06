puts "🌱 Seeding users ..."

puts "1. Create Users"
user = User.create(
  username: "user",
  email: "user@user.com",
  password: "password"
)


users = []
users << user
5.times do
  new_user = User.create(
    username: Faker::Internet.username,
    email: Faker::Internet.email,
    password: Faker::Internet.password
  )

  users << new_user
end

puts "2. Create projects"
projects = []
30.times do
  projects << Project.create(
    name: Faker::Team.state,
    topic: Faker::Space.galaxy,
    details: Faker::Lorem.paragraph,
  )
end

puts "3. Associate certain projects with certain users"
projects.each do |project|
  ProjectMembership.create(user_id: users.sample.id, project_id: projects.sample.id)
end


puts "4. Create Statuses"
50.times do 
  Status.create(
    summary: Faker::Lorem.sentence(word_count: rand(1..5)),
    details: Faker::Lorem.sentence,
    project_id: projects.sample.id
  )
end

puts "✅ Done seeding!"
