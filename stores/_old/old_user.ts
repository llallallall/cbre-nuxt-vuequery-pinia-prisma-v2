import { defineStore } from 'pinia'


type ProfileType = {
        id? : string | null
        name? : string | null
        email? : string | null

        company : string | null
        branch : string | null
        department : string | null
        title :string | null

        avatar? : string | null
        photo :  string | null

        usePhoto : boolean

}

type UserType = {
        id : string | null
        name  : string | null
        email  : string | null
        image?  : string | null
        role  : string | null
        profile? : ProfileType
}
export const useUserStore = defineStore('user', {
        state: () => ({
                
                isLogin: false,

                //id
                userId: '' as string,
                
                //detail
                userImage: '' as string,

                //id
                userPassword: '' as string,
                
                //profile
                profile : {

                        id : '' as string,
                        name : '' as string,
                        email : '' as string,
                
                        company : '' as string,
                        branch : '' as string,
                        department : '' as string,
                        title: '' as string,
                
                        avatar : '' as string,
                        photo : '' as string,
                
                        usePhoto : false as boolean

                } as ProfileType,

                allUsers : [] as UserType[]
        }),
        getters: {},

        actions: {

                async getAllUsers() {

                        try {

                            let res =  await useFetch("/api/auth/allusers", {
                                        method: "GET"
                                  })

                                //   console.log('getAllUsers()')
                                //   console.log(res.data.value)
                             
                             this.allUsers = res.data.value as any

                             return true 

                        } catch (error) {
                                console.log(error)

                                return error
                        }
                

                },

                async getUserProfile(currentUser : any) {

                        // console.log('getUserProfile')
                        // console.log(currentUser)
                        let id = currentUser.user.id as string
                        // console.log(id)
                        try {

                                if(id) {

                                        this.isLogin = true
        
                                        this.userId = currentUser.user.id as string
                                        this.profile.avatar  = currentUser.user.image as string
        
                                        this.profile.id = currentUser.user.id as string
                                        this.profile.name = currentUser.user.name as string
                                        this.profile.email = currentUser.user.email as string
                                        this.profile.avatar = currentUser.user.image as string
                                        //console.log(this.profile)
                                        
                                } else {
        
                                        this.userImage = '/images/avatar/avatar-placeholder.png'
                                }


                                await useFetch("/api/auth/userProfile", {
                                        method: "GET",
                                        params: {'id': id},
                                  }).then( (res : any) => {
                                        let profileResult = res.data.value;
                                        // console.log('profileResult')
                                        // console.log(profileResult)
                                        if(profileResult) {
                                                this.profile.company = profileResult?.company as string
                                                this.profile.branch = profileResult?.branch as string
                                                this.profile.department = profileResult?.department as string
                                                this.profile.title = profileResult?.title as string
                        
                                                this.profile.photo = profileResult?.image_url as string
                                                this.profile.usePhoto = profileResult?.use_profile_image as boolean
                                        }

                                        //@ts-ignore
                                        if(profileResult.use_profile_image) {
                                                // photo 
                                                        const searchTerm = '/images/';
                                                        let imageUrl = this.profile?.photo as string
                                                        let indexOfFirst = imageUrl.indexOf(searchTerm) as number
                                                        
                                                        if ( imageUrl.length > 0  && indexOfFirst > -1) {
                                                                this.userImage = this.profile?.avatar as string
                                                        } else {
                                                                this.userImage = '/images/avatar/avatar-placeholder.png'
                                                        }
                                
                                        } else {
                                                // avatar
                                
                                                        const searchTerm = '/images/';
                                                        let imageUrl = this.profile?.avatar as string
                                                        let indexOfFirst = imageUrl.indexOf(searchTerm) as number
                                                        
                                                        if ( imageUrl.length > 0  && indexOfFirst > -1) {
                                                                this.userImage = this.profile?.avatar as string
                                                        } else {
                                                                this.userImage = '/images/avatar/avatar-placeholder.png'
                                                        }
                                
                                
                                        }


                                  })
                          
                                

                                
                               
                                
                               return true
                                  
                               
                        } catch (error) {
                                console.log(error)

                                return error
                        }
                },
              


        },
})