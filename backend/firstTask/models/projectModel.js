const mongoose = require("mongoose")
const projectSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      unique : true
    },
    description: {
      type: String,
      required: true,
    },
    slug:{
      type:String,
      required:true,
      unique:true,
      lowercase :true
  },
   status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    developers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Developer', required: true }],
    designers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Designer', required: true }],
   totalDevelopers : {
    type : String,
    default : 0
},
   totalDesigners : {
  type : String,
  default : 0
},
    deadline: {
      type: Date,
      required: true,
    }
  },
  {
    timestamps : true
}
);
// projectSchema.methods.addMember = async function (memberId, role) {
//   switch (role) {
//     case "developer":
//       if (!this.developers.some(developer => developer.developerId.toString() === memberId.toString())) {
//         this.developers.unshift({ developerId: memberId });
//         this.totalDevelopers = this.developers.length;
//         await this.save();
//     }
//  return this
//     case "designer":
//         if (!this.designers.some(designer => designer.designerId.toString() === memberId.toString())) {
//           this.designers.unshift({ designerId: memberId });
//           this.totalDesigners = this.designers.length;
//           await this.save();
//       }
// return this

//   }
// };
projectSchema.methods.addMember = async function (memberId, role) {
  switch (role) {
    case "developer":
      // Check if memberId is already in developers array
      if (!this.developers.some(developerId => developerId.toString() === memberId.toString())) {
        this.developers.unshift(memberId);  // Push memberId directly
        this.totalDevelopers = this.developers.length;  // Update totalDevelopers count
        await this.save();
      }
      return this;

    case "designer":
      // Check if memberId is already in designers array
      if (!this.designers.some(designerId => designerId.toString() === memberId.toString())) {
        this.designers.unshift(memberId);  // Push memberId directly
        this.totalDesigners = this.designers.length;  // Update totalDesigners count
        await this.save();
      }
      return this;
  }
};
projectSchema.methods.removeMember = async function(memberId, role) {
  switch (role) {
    case "developer":
      // Store initial length of developers array
      const initialDevelopersLength = this.developers.length;

      // Filter out the memberId from developers array
      this.developers = this.developers.filter(
        developerId => developerId.toString() !== memberId.toString()
      );

      // If the length has changed, update and save the project
      if (this.developers.length !== initialDevelopersLength) {
        this.totalDevelopers = this.developers.length;
        await this.save();
      }
      return this;

    case "designer":
      // Store initial length of designers array
      const initialDesignersLength = this.designers.length;

      // Filter out the memberId from designers array
      this.designers = this.designers.filter(
        designerId => designerId.toString() !== memberId.toString()
      );

      // If the length has changed, update and save the project
      if (this.designers.length !== initialDesignersLength) {
        this.totalDesigners = this.designers.length;
        await this.save();
      }
      return this;

    default:
      throw new Error("Invalid role");
  }
};

// projectSchema.methods.removeMember = async function(memberId, role){
//   switch (role) {
//     case "developer":
    
//     const initialDevelopersLength = this.developers.length;
//     this.developers = this.developers.filter(
//         developer => developer.developerId.toString() !== memberId.toString()
//     );
  
//     // If the length has changed, it means a bookmark was removed
//     if (this.developers.length !== initialDevelopersLength) {
//         this.totalDevelopers = this.developers.length;
//         await this.save();
//     }
    
//     return this;
//       case "designer":
    
//       const initialDesignersLength = this.designers.length;
//       this.designers = this.designers.filter(
//           designer => designer.designerId.toString() !== memberId.toString()
//       );
    
//       // If the length has changed, it means a bookmark was removed
//       if (this.designers.length !== initialDesignersLength) {
//           this.totalDesigners = this.designers.length;
//           await this.save();
//       }
      
//       return this;
//   }

// }

  const Project = mongoose.model('Project', projectSchema);
  module.exports = Project;
  