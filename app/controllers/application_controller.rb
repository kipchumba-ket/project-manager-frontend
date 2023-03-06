class ApplicationController < Sinatra::Base
  set :default_content_type, 'application/json'
  use Rack::Session::Cookie, :expire_after => 259200000000
  
  # To enable cross origin requests for all routes:
  set :bind, '0.0.0.0'
  configure do
    enable :cross_origin
  end
  before do
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = '*'
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE"
  end
  
  # routes...
  options "*" do
    response.headers["Allow"] = "GET, PUT, POST, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, Accept, X-User-Email, X-Auth-Token"
    response.headers["Access-Control-Allow-Origin"] = "*"
    200
  end



  # GET ---------------------------------------------------------------------------# Add your routes here
  def authorized
    User.find(session[:user_id])
  end

  get '/me' do
    begin
      authorized.to_json(only: [:id, :username, :password, :first_name, :last_name])
    rescue ActiveRecord::RecordNotFound => e 
      status 401
      {error: "Unauthorized"}.to_json
    end
  end

  get "/my-projects/:id" do
    begin
      user  = User.find(params[:id])
      user.projects.to_json(include: [:statuses, :users])
    rescue ActiveRecord::RecordNotFound => e
      status 401
      {error: "Unauthorized"}.to_json
    end   
  end

  get "/projects" do
    begin
      # user  = authorized
      # user.projects.to_json
      Project.all.to_json(include: [:statuses, :users])
    rescue ActiveRecord::RecordNotFound => e
      status 401
      {error: "Unauthorized"}.to_json
    end
  end

  get "/projects/:id" do
    begin
      # authorized
      project = Project.find(params[:id])
      project.to_json(include: [:statuses, :users])
    rescue ActiveRecord::RecordNotFound => e
      status 401
      {error: "Unauthorized"}.to_json
    end
  end

  get "/users" do
    begin
      # authorized
      status 200
      User.all.to_json(except: [:created_at, :updated_at], include: [:projects])
    rescue ActiveRecord::RecordNotFound => e
      status 401
      {error: "Unauthorized"}.to_json
    end
  end

  get "/users/:id" do
    begin
      # authorized
      user = User.find_by(id: params[:id])

      if(user.nil?)
        status 404
        {error: "User not found"}.to_json
      else
        status 200
        user.to_json(include: [:projects])
      end
    rescue ActiveRecord::RecordNotFound => e
      status 401
      {error: "Unauthorized"}.to_json
    end
  end


  # POST ---------------------------------------------------------------------------
  post "/login" do
    user = User.where(["username=? and password=?", params[:username], params[:password]])[0]

    if (user.nil?)
      status 403
      {error: "Wrong email or password"}.to_json
    else
      status 200
      session[:user_id] = user.id
      user.to_json
    end
  end

  post "/signup" do
    user = User.create(
      username: params[:username],
      email: params[:email],
      password: params[:password]
    )
    
    if (user.nil?)
      status 403
      {error: "Wrong email or password"}.to_json
    else
      status 201
      session[:user_id] = user.id
      user.to_json
    end
  end


  post "/projects" do
    begin
      # authorized
      project = Project.create(
        name: params[:name],
        topic: params[:topic],
        details: params[:details],
      )

      status 201
      project.to_json(include: [:statuses, :users])
    rescue ActiveRecord::RecordNotFound => e
      status 401
      {error: "Unauthorized"}.to_json
    end
  end

  post "/statuses" do
    begin
      # authorized
      project_status = Status.create(
        summary: params[:summary],
        details: params[:details],
        project_id: params[:project_id]
      )

      status 201
      project_status.to_json
    rescue ActiveRecord::RecordNotFound => e
      status 401
      {error: "Unauthorized"}.to_json
    end    
  end

  post "/project-memberships" do
    begin
      # authorized
      project_membership = ProjectMembership.create(
        user_id: params[:user_id],
        project_id: params[:project_id]
      )

      status 201
      project_membership.to_json(include: [:project, :user])
    rescue ActiveRecord::RecordNotFound => e
      status 401
      {error: "Unauthorized"}.to_json
    end    
  end

  # PATCH ---------------------------------------------------------------------------
  patch "/projects/:id" do
    begin
      # authorized
      project = Project.find_by(id: params[:id])
      project.update(
        name: params[:name],
        topic: params[:topic],
        details: params[:details],
        user_id: params[:user_id]
      )
      project.to_json(include: [:statuses, :users])
    rescue ActiveRecord::RecordNotFound => e
      status 401
      {error: "Unauthorized"}.to_json
    end
  end

  patch "/statuses/:id" do
    begin
      # authorized
      project_status = Status.find_by(id: params[:id])
      project_status.update(
        summary: params[:summary],
        details: params[:details],
        project_id: params[:project_id]
      )
      project_status.to_json(include: statuses)
    rescue ActiveRecord::RecordNotFound => e
      status 401
      {error: "Unauthorized"}.to_json
    end
  end

  # DELETE ---------------------------------------------------------------------------
  delete "/projects/:id" do
    begin
      # authorized
      project = Project.find(params[:id])
      project.destroy
      
      status 204
    rescue ActiveRecord::RecordNotFound => e
      status 401
      {error: "Unauthorized"}.to_json
    end
  end

  delete "/statuses/:id" do
    begin
      # authorized
      project_status = Status.find(params[:id])
      project_status.destroy
      
      status 204
    rescue ActiveRecord::RecordNotFound => e
      status 401
      {error: "Unauthorized"}.to_json
    end
  end

  delete "/logout" do
    begin
      # authorized
      session.delete :user_id
      status 204
    rescue ActiveRecord::RecordNotFound => e
      status 401
      {error: "Already logged out"}.to_json
    end
  end
end
