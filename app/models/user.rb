class User < ActiveRecord::Base
    has_many :project_memberships
    has_many :projects, through: :project_memberships
end