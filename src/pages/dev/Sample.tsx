import { useForm } from "react-hook-form"
import { sampleSchema, type SampleFormData } from "./sample.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
// import ToasterComponent from "./ToasterComponent"

const Sample = () => {

  const { register, handleSubmit, formState: { errors } } = useForm<SampleFormData>({
    resolver: zodResolver(sampleSchema)
  })


  function sampleFunc(data: SampleFormData) {
    console.log(data)
  }

  return (
    <>
      <div>
        <h1>Sample</h1>
        <form onSubmit={handleSubmit(sampleFunc)}>
          <label htmlFor="name">Name</label>
          <Input className="w-100" {...register("name")} />

          <label htmlFor="email">Email</label>
          <Input className="w-100" {...register("email")} />

          <label htmlFor="password">Password</label>
          <Input className="w-100" {...register("password")} />

          <Button variant={"primary"} type="submit">Submit</Button>

          {errors.name && <p>{errors.name.message}</p>}
          {errors.email && <p>{errors.email.message}</p>}
          {errors.password && <p>{errors.password.message}</p>}
        </form>
      </div>

      {/* <ToasterComponent /> */}
    </>
  )
}

export default Sample;