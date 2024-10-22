const mongoose = require('mongoose');
const developerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'developer', 'designer', 'administrator'],
    default: 'developer',
  },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }],
  totalProjects : {
    type : String,
    default : 0
},
  accessToken : {
    type:String
},
  refreshToken : {
  type : String
}
},
{
  timestamps : true
}
);







// developerSchema.methods.addProject = async function (projectId) {
//       if (!this.projects.some(project => project.projectId.toString() === projectId.toString())) {
//         this.projects.unshift({ projectId: projectId });
//         this.totalProjects = this.projects.length;
//         await this.save();
//   }
// };
developerSchema.methods.addProject = async function (projectId) {
  if (!this.projects.some(id => id.toString() === projectId.toString())) {
    this.projects.unshift(projectId);  // Directly add projectId to the array
    this.totalProjects = this.projects.length;  // Update total projects count
    await this.save();
  }
  return this;
};
developerSchema.methods.removeProject = async function (projectId) {
  const initialProjectsLength = this.projects.length;
  this.projects = this.projects.filter(id => id.toString() !== projectId.toString());
  if (this.projects.length !== initialProjectsLength) {
    this.totalProjects = this.projects.length;
    await this.save();
  }
  return this;
};

// developerSchema.methods.removeProject = async function(projectId){
//     const initialProjectsLength = this.projects.length;
//     this.projects = this.projects.filter(
//         project => project.projectId.toString() !== projectId.toString()
//     );
//     if (this.projects.length !== initialProjectsLength) {
//         this.totalProjects = this.projects.length;
//         await this.save();
//     }
//     return this;
  
// }
const User = mongoose.model('Developer', developerSchema);
module.exports = User;
