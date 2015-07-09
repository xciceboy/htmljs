// Generated by CoffeeScript 1.9.3
(function() {
  var Job, JobZan, User, func_job;

  Job = __M('job/jobs');

  JobZan = __M('job/job_zans');

  User = __M("users");

  User.hasOne(Job, {
    foreignKey: "user_id"
  });

  Job.belongsTo(User, {
    foreignKey: "user_id"
  });

  User.hasOne(JobZan, {
    foreignKey: "user_id"
  });

  JobZan.belongsTo(User, {
    foreignKey: "user_id"
  });

  Job.sync();

  JobZan.sync();

  func_job = {
    getAll: function(page, count, condition, order, include, callback) {
      var query;
      if (arguments.length === 4) {
        callback = order;
        order = null;
        include = null;
      } else if (arguments.length === 5) {
        callback = include;
        include = null;
      }
      query = {
        offset: (page - 1) * count,
        limit: count,
        order: order,
        include: [User],
        raw: true
      };
      if (condition) {
        query.where = condition;
      }
      return Job.findAll(query).success(function(jobs) {
        return callback(null, jobs);
      }).error(function(e) {
        return callback(e);
      });
    },
    addZan: function(job_id, user_id, callback) {
      var self;
      self = this;
      return JobZan.find({
        where: {
          job_id: job_id,
          user_id: user_id
        }
      }).success(function(zan) {
        if (zan) {
          return callback(new Error('已经表示过感兴趣！'));
        } else {
          return JobZan.create({
            job_id: job_id,
            user_id: user_id
          }).success(function(zan) {
            callback(null, zan);
            return Job.find({
              where: {
                id: job_id
              }
            }).success(function(job) {
              if (job) {
                return job.updateAttributes({
                  zan_count: job.zan_count * 1 + 1
                });
              }
            });
          }).error(function(e) {
            return callback(e);
          });
        }
      }).error(function(e) {
        return callback(e);
      });
    },
    getZans: function(job_id, callback) {
      return JobZan.findAll({
        where: {
          job_id: job_id
        },
        include: [User]
      }).success(function(jobs) {
        return callback(null, jobs);
      }).error(function(e) {
        return callback(e);
      });
    },
    hasZan: function(job_id, user_id, callback) {
      return JobZan.find({
        where: {
          job_id: job_id,
          user_id: user_id
        }
      }).success(function(job) {
        return callback(null, job);
      }).error(function(e) {
        return callback(e);
      });
    }
  };

  __FC(func_job, Job, ['getById', 'delete', 'update', 'count', 'add', 'addCount', 'getByField']);

  module.exports = func_job;

}).call(this);